// ============================================
// ElevenLabs Voice Cloning & Text-to-Speech Service
// ============================================

const ELEVENLABS_BASE_URL = "https://api.elevenlabs.io/v1";

// ============================================
// Types
// ============================================

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  labels: Record<string, string>;
  description: string | null;
  preview_url: string | null;
  settings: {
    stability: number;
    similarity_boost: number;
  } | null;
}

interface ElevenLabsVoicesResponse {
  voices: ElevenLabsVoice[];
}

interface ElevenLabsAddVoiceResponse {
  voice_id: string;
}

interface ElevenLabsErrorResponse {
  detail?: {
    status: string;
    message: string;
  };
}

export interface TextToSpeechOptions {
  modelId?: string;
}

// ============================================
// Helpers
// ============================================

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new ElevenLabsError(
      "ELEVENLABS_API_KEY environment variable is not set",
      "MISSING_API_KEY"
    );
  }
  return key;
}

export class ElevenLabsError extends Error {
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, code: string, statusCode?: number) {
    super(message);
    this.name = "ElevenLabsError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

async function handleErrorResponse(response: Response): Promise<never> {
  let message = `ElevenLabs API error: ${response.status} ${response.statusText}`;
  try {
    const body = (await response.json()) as ElevenLabsErrorResponse;
    if (body.detail?.message) {
      message = body.detail.message;
    }
  } catch {
    // If we cannot parse the error body, use the default message
  }
  throw new ElevenLabsError(message, "API_ERROR", response.status);
}

// ============================================
// Service Functions
// ============================================

/**
 * Clone a voice using audio samples.
 *
 * @param name - Display name for the cloned voice
 * @param audioFiles - Array of audio file Buffers (mp3, wav, etc.)
 * @returns Object containing the new voiceId
 */
export async function cloneVoice(
  name: string,
  audioFiles: Buffer[]
): Promise<{ voiceId: string }> {
  if (audioFiles.length === 0) {
    throw new ElevenLabsError(
      "At least one audio file is required for voice cloning",
      "INVALID_INPUT"
    );
  }

  const apiKey = getApiKey();

  const formData = new FormData();
  formData.append("name", name);

  for (let i = 0; i < audioFiles.length; i++) {
    const file = audioFiles[i]!;
    const blob = new Blob([file], { type: "audio/mpeg" });
    formData.append("files", blob, `sample_${i}.mp3`);
  }

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices/add`, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const data = (await response.json()) as ElevenLabsAddVoiceResponse;

  return { voiceId: data.voice_id };
}

/**
 * Convert text to speech using a specific voice.
 *
 * @param voiceId - The ElevenLabs voice ID to use
 * @param text - The text to synthesize
 * @param options - Optional settings (modelId, etc.)
 * @returns Audio data as a Buffer
 */
export async function textToSpeech(
  voiceId: string,
  text: string,
  options?: TextToSpeechOptions
): Promise<Buffer> {
  if (!text.trim()) {
    throw new ElevenLabsError(
      "Text must not be empty",
      "INVALID_INPUT"
    );
  }

  const apiKey = getApiKey();
  const modelId = options?.modelId ?? "eleven_multilingual_v2";

  const response = await fetch(
    `${ELEVENLABS_BASE_URL}/text-to-speech/${encodeURIComponent(voiceId)}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
      }),
    }
  );

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * List all available voices on the account.
 *
 * @returns Array of ElevenLabsVoice objects
 */
export async function listVoices(): Promise<ElevenLabsVoice[]> {
  const apiKey = getApiKey();

  const response = await fetch(`${ELEVENLABS_BASE_URL}/voices`, {
    method: "GET",
    headers: {
      "xi-api-key": apiKey,
    },
  });

  if (!response.ok) {
    await handleErrorResponse(response);
  }

  const data = (await response.json()) as ElevenLabsVoicesResponse;

  return data.voices;
}
