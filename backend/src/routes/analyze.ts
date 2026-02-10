import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { AnalyzePersonaRequestSchema } from "../types";
import { analyzeContentForPersona } from "../services/persona-analyzer";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const analyzeRouter = new Hono<{ Variables: AuthVariables }>();

// Apply auth middleware to all routes - require authentication
analyzeRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      401
    );
  }
  await next();
});

// POST /api/analyze/persona - Analyze content and extract persona profile
analyzeRouter.post(
  "/persona",
  zValidator("json", AnalyzePersonaRequestSchema),
  async (c) => {
    const user = c.get("user")!;
    const { content } = c.req.valid("json");

    let analysis;
    try {
      analysis = await analyzeContentForPersona(content);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Persona analysis failed";
      return c.json(
        { error: { message, code: "ANALYSIS_FAILED" } },
        500
      );
    }

    // Upsert the user's persona with the analysis results
    const existing = await prisma.persona.findFirst({
      where: { userId: user.id },
    });

    if (existing) {
      await prisma.persona.update({
        where: { id: existing.id },
        data: {
          bio: analysis.bio,
          topics: JSON.stringify(analysis.topics),
          style: analysis.style,
          catchphrases: JSON.stringify(analysis.catchphrases),
          targetAudience: analysis.targetAudience,
        },
      });
    } else {
      await prisma.persona.create({
        data: {
          userId: user.id,
          bio: analysis.bio,
          topics: JSON.stringify(analysis.topics),
          style: analysis.style,
          catchphrases: JSON.stringify(analysis.catchphrases),
          targetAudience: analysis.targetAudience,
        },
      });
    }

    return c.json({ data: analysis });
  }
);

export { analyzeRouter };
