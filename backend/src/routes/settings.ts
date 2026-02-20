import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { prisma } from "../prisma";
import { auth } from "../auth";
import { UpdateUserSettingsSchema, UpdateProfileSchema } from "../types";

type AuthVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

const settingsRouter = new Hono<{ Variables: AuthVariables }>();

// Auth middleware - require authentication for all routes
settingsRouter.use("*", async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json(
      { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      401
    );
  }
  await next();
});

// GET /api/settings - Get user settings (creates defaults if not exists)
settingsRouter.get("/", async (c) => {
  const user = c.get("user")!;

  let settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  // Create default settings if they don't exist
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: { userId: user.id },
    });
  }

  return c.json({
    data: {
      settings,
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image ?? null,
      },
    },
  });
});

// PUT /api/settings - Update user settings
settingsRouter.put(
  "/",
  zValidator("json", UpdateUserSettingsSchema),
  async (c) => {
    const user = c.get("user")!;
    const body = c.req.valid("json");

    // Upsert: create if not exists, update if exists
    const settings = await prisma.userSettings.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...body,
      },
      update: body,
    });

    return c.json({ data: settings });
  }
);

// PUT /api/settings/profile - Update user profile (name, email)
settingsRouter.put(
  "/profile",
  zValidator("json", UpdateProfileSchema),
  async (c) => {
    const user = c.get("user")!;
    const body = c.req.valid("json");

    // Check if email is being changed and if it's already taken
    if (body.email && body.email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existingUser && existingUser.id !== user.id) {
        return c.json(
          {
            error: {
              message: "Email is already in use",
              code: "EMAIL_TAKEN",
            },
          },
          409
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.email !== undefined ? { email: body.email } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return c.json({ data: updatedUser });
  }
);

export { settingsRouter };
