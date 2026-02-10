import OpenAI from "openai";
import type { ContentPlatform, ContentTone } from "../types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScriptPersona {
  bio: string | null;
  topics: string[] | null;
  style: string | null;
  catchphrases: string[] | null;
  targetAudience: string | null;
}

export interface GenerateScriptOptions {
  persona: ScriptPersona;
  platform: ContentPlatform;
  topic?: string;
  tone?: ContentTone;
  language?: string;
}

// ---------------------------------------------------------------------------
// OpenAI client (lazy singleton)
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
// Prompt builders
// ---------------------------------------------------------------------------

function buildPersonaBlock(persona: ScriptPersona): string {
  const lines: string[] = [];

  if (persona.bio) {
    lines.push(`Bio / Beschreibung: ${persona.bio}`);
  }
  if (persona.topics && persona.topics.length > 0) {
    lines.push(`Themen: ${persona.topics.join(", ")}`);
  }
  if (persona.style) {
    lines.push(`Stil / Tonalitaet: ${persona.style}`);
  }
  if (persona.catchphrases && persona.catchphrases.length > 0) {
    lines.push(`Typische Phrasen / Catchphrases: ${persona.catchphrases.join(" | ")}`);
  }
  if (persona.targetAudience) {
    lines.push(`Zielgruppe: ${persona.targetAudience}`);
  }

  return lines.join("\n");
}

const TONE_DESCRIPTIONS: Record<ContentTone, string> = {
  motivierend: "motivierend, energisch, empowernd",
  informativ: "sachlich, lehrreich, klar strukturiert",
  unterhaltsam: "locker, witzig, unterhaltsam",
  provokant: "polarisierend, mutig, kontrovers",
};

function buildVideoPrompt(opts: GenerateScriptOptions): string {
  const { persona, platform, topic, tone, language = "de" } = opts;

  const platformLabel =
    platform === "instagram_reel" ? "Instagram Reel" : "TikTok Video";

  const toneInstruction = tone
    ? `Der Ton soll ${TONE_DESCRIPTIONS[tone]} sein.`
    : "Waehle einen Ton, der zur Persona passt.";

  const topicInstruction = topic
    ? `Das Thema ist: "${topic}".`
    : "Waehle ein passendes Thema aus den Interessen der Persona.";

  return `Du bist ein erfahrener Content-Skript-Autor fuer Social Media.

Deine Aufgabe: Schreibe ein Skript fuer ein ${platformLabel} (15-60 Sekunden) das klingt, als haette es die folgende Person SELBST geschrieben und gesprochen. Der Content soll authentisch und persoenlich wirken – NICHT wie von einer Agentur.

=== PERSONA ===
${buildPersonaBlock(persona)}
===============

${topicInstruction}
${toneInstruction}

Sprache: ${language === "de" ? "Deutsch" : language}

WICHTIG:
- Benutze die Catchphrases und den Stil der Persona natuerlich eingebaut.
- Schreibe so, wie die Person WIRKLICH reden wuerde – mit ihrem Vokabular, ihren Eigenheiten.
- Das Skript muss in der Ich-Perspektive sein.
- Halte es kurz und praegnant (max. 150 Woerter).

Formatiere das Skript EXAKT so:

HOOK:
[Ein packender erster Satz, der sofort Aufmerksamkeit erregt – max. 2 Saetze]

HAUPTTEIL:
[Der Kerncontent – informativ, unterhaltsam oder motivierend – 3-5 Saetze]

CTA:
[Call-to-Action – was soll der Zuschauer tun? Folgen, kommentieren, teilen etc. – 1-2 Saetze]`;
}

function buildTweetPrompt(opts: GenerateScriptOptions): string {
  const { persona, topic, tone, language = "de" } = opts;

  const toneInstruction = tone
    ? `Der Ton soll ${TONE_DESCRIPTIONS[tone]} sein.`
    : "Waehle einen Ton, der zur Persona passt.";

  const topicInstruction = topic
    ? `Das Thema ist: "${topic}".`
    : "Waehle ein passendes Thema aus den Interessen der Persona.";

  return `Du bist ein erfahrener Social-Media-Texter.

Schreibe einen einzelnen Tweet (max. 280 Zeichen!) der klingt, als haette ihn die folgende Person selbst geschrieben.

=== PERSONA ===
${buildPersonaBlock(persona)}
===============

${topicInstruction}
${toneInstruction}

Sprache: ${language === "de" ? "Deutsch" : language}

WICHTIG:
- MAXIMAL 280 Zeichen inklusive Leerzeichen und Emojis.
- Benutze den Stil und die Sprache der Persona.
- Baue wenn passend eine ihrer Catchphrases ein.
- Kein Hashtag-Spam – maximal 2 Hashtags.
- Gib NUR den Tweet-Text zurueck, keine Erklaerungen oder Anmerkungen.`;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

/**
 * Generates a content script using OpenAI based on the creator's persona.
 *
 * - For video platforms (instagram_reel, tiktok): returns a structured script
 *   with HOOK, HAUPTTEIL, and CTA sections.
 * - For x_post: returns a tweet of max 280 characters.
 */
export async function generateScript(
  opts: GenerateScriptOptions
): Promise<string> {
  const client = getClient();

  const isVideo = opts.platform === "instagram_reel" || opts.platform === "tiktok";
  const prompt = isVideo ? buildVideoPrompt(opts) : buildTweetPrompt(opts);

  const response = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "Du bist ein KI-Assistent der authentische Social-Media-Inhalte erstellt. " +
          "Du antwortest IMMER nur mit dem fertigen Skript/Text – keine Meta-Kommentare, " +
          "keine Erklaerungen, keine Einleitungen.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.85,
    max_tokens: 600,
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response. Please try again.");
  }

  // For tweets, enforce the 280 char limit as a safety net
  if (opts.platform === "x_post") {
    return content.trim().slice(0, 280);
  }

  return content.trim();
}
