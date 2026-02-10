import OpenAI from "openai";
import type { PersonaAnalysis } from "../types";

// ---------------------------------------------------------------------------
// OpenAI client (lazy singleton) – same pattern as openai.ts
// ---------------------------------------------------------------------------

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "OPENAI_API_KEY is not set. Please configure the environment variable."
      );
    }
    _client = new OpenAI({ apiKey });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Prompt
// ---------------------------------------------------------------------------

function buildAnalysisPrompt(contentItems: string[]): string {
  const joined = contentItems
    .map((item, i) => `--- Content ${i + 1} ---\n${item}`)
    .join("\n\n");

  return `You are an expert content strategist and persona analyst.

Analyze the following pieces of content created by a single creator (posts, video transcripts, tweets, etc.) and extract a comprehensive persona profile.

${joined}

Based on all the content above, return a JSON object with EXACTLY these keys:

{
  "bio": "A concise 1-3 sentence biography summarising who this creator is and what they do.",
  "topics": ["topic1", "topic2", ...],
  "style": "A description of their communication style (e.g. casual, professional, humorous, motivational, etc.). 1-3 sentences.",
  "catchphrases": ["phrase1", "phrase2", ...],
  "targetAudience": "A description of who their content seems aimed at. 1-2 sentences."
}

Rules:
- "topics" should contain 3-8 specific topics/themes you identified.
- "catchphrases" should contain 2-6 recurring phrases, expressions, or signature words they use often. If none are clearly repeated, extract distinctive expressions that define their voice.
- Be specific and concrete, not generic.
- Respond ONLY with the JSON object, no additional text.`;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Analyzes an array of content strings (posts, transcripts, etc.) using GPT-4o
 * and returns a structured persona profile.
 */
export async function analyzeContentForPersona(
  content: string[]
): Promise<PersonaAnalysis> {
  const client = getClient();

  const prompt = buildAnalysisPrompt(content);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an expert content analyst. You always respond with valid JSON and nothing else.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content;

  if (!raw) {
    throw new Error("OpenAI returned an empty response during persona analysis.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("OpenAI returned invalid JSON during persona analysis.");
  }

  // Validate the shape matches what we expect
  const result = parsed as Record<string, unknown>;

  if (
    typeof result.bio !== "string" ||
    !Array.isArray(result.topics) ||
    typeof result.style !== "string" ||
    !Array.isArray(result.catchphrases) ||
    typeof result.targetAudience !== "string"
  ) {
    throw new Error(
      "OpenAI returned an unexpected JSON shape during persona analysis."
    );
  }

  return {
    bio: result.bio,
    topics: result.topics as string[],
    style: result.style,
    catchphrases: result.catchphrases as string[],
    targetAudience: result.targetAudience,
  };
}
