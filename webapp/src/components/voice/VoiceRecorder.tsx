import { useState, useRef, useCallback, useEffect } from "react";
import { Mic, Square, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  disabled?: boolean;
}

const VoiceRecorder = ({ onRecordingComplete, disabled = false }: VoiceRecorderProps) => {
  const [state, setState] = useState<"idle" | "recording" | "recorded">("idle");
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ":" + secs.toString().padStart(2, "0");
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setState("recorded");
        onRecordingComplete(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch {
      console.error("[VoiceRecorder] Microphone access denied");
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [state]);

  const resetRecording = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setState("idle");
    setDuration(0);
    setIsPlaying(false);
  }, [audioUrl]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => setIsPlaying(false);
    }
  }, [isPlaying, audioUrl]);

  return (
    <Card className="p-6 space-y-6">
      <audio ref={audioRef} className="hidden" />

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">Record Voice</h3>
        <p className="text-sm text-muted-foreground">
          Speak for at least 30 seconds so we can clone your voice.
        </p>
      </div>

      {/* Visualizer area */}
      <div className="flex items-center justify-center h-24">
        {state === "recording" ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-pulse"
                style={{
                  height: Math.random() * 48 + 16 + "px",
                  animationDelay: i * 0.05 + "s",
                  animationDuration: 0.3 + Math.random() * 0.4 + "s",
                }}
              />
            ))}
          </div>
        ) : state === "recorded" ? (
          <div className="flex items-center gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary/40 rounded-full"
                style={{ height: Math.random() * 48 + 16 + "px" }}
              />
            ))}
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
            <Mic className="w-8 h-8 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="text-center">
        <span className="text-2xl font-mono font-semibold text-foreground tabular-nums">
          {formatTime(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {state === "idle" ? (
          <Button
            size="lg"
            onClick={startRecording}
            disabled={disabled}
            className="gap-2 px-6 py-6 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </Button>
        ) : state === "recording" ? (
          <Button
            size="lg"
            onClick={stopRecording}
            className="gap-2 px-6 py-6 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            <Square className="w-5 h-5" />
            Stop
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={resetRecording}
              disabled={disabled}
              className="gap-2 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
              Record Again
            </Button>
            <Button
              size="lg"
              onClick={togglePlayback}
              disabled={disabled}
              className={cn(
                "gap-2 rounded-xl",
                isPlaying ? "bg-primary/80" : "bg-primary"
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Duration hint */}
      {state === "recording" && duration < 30 ? (
        <p className="text-xs text-center text-amber-500">
          {30 - duration} more seconds recommended
        </p>
      ) : null}
      {state === "recording" && duration >= 30 ? (
        <p className="text-xs text-center text-green-500">
          Sufficient recording length reached
        </p>
      ) : null}
    </Card>
  );
};

export default VoiceRecorder;
