import { spawn } from "child_process";
import { randomUUID } from "crypto";
import { unlink } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

/**
 * Extract audio from a video file using FFmpeg.
 * Returns MP3 audio buffer optimized for voice cloning.
 */
export async function extractAudioFromVideo(videoBuffer: Buffer): Promise<Buffer> {
  const id = randomUUID();
  const tmpDir = tmpdir();
  const inputPath = join(tmpDir, `${id}_input.mp4`);
  const outputPath = join(tmpDir, `${id}_output.mp3`);

  try {
    // Write video to temp file
    await Bun.write(inputPath, videoBuffer);

    // Extract audio with FFmpeg
    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn("ffmpeg", [
        "-i", inputPath,
        "-vn",                    // No video
        "-acodec", "libmp3lame",  // MP3 codec
        "-ab", "128k",            // 128kbps bitrate
        "-ac", "1",               // Mono (better for voice cloning)
        "-ar", "44100",           // 44.1kHz sample rate
        "-y",                     // Overwrite output
        outputPath,
      ]);

      let stderr = "";
      ffmpeg.stderr.on("data", (data: Buffer) => {
        stderr += data.toString();
      });

      ffmpeg.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr.slice(-500)}`));
        }
      });

      ffmpeg.on("error", (err) => {
        reject(new Error(`FFmpeg spawn error: ${err.message}`));
      });
    });

    // Read the extracted audio
    const audioFile = Bun.file(outputPath);
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());

    if (audioBuffer.length === 0) {
      throw new Error("FFmpeg produced empty audio output");
    }

    console.log(`[AudioExtractor] Extracted ${audioBuffer.length} bytes of audio from video`);

    return audioBuffer;
  } finally {
    // Clean up temp files
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
