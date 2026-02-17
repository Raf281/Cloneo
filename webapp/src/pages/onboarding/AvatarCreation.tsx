import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Video,
  Image,
  Check,
  X,
  AlertCircle,
  ChevronRight,
  Loader2,
  Mic,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import VoiceRecorder from "@/components/voice/VoiceRecorder";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Avatar } from "@/lib/types";

interface UploadedFile {
  id: string;
  name: string;
  type: "video" | "image";
  size: number;
  progress: number;
  status: "uploading" | "complete" | "error";
  file: File;
}

const AvatarCreation = () => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [voiceRecording, setVoiceRecording] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

  const requirements = [
    { text: "Video mit klarer Stimme (fur Voice Cloning)", met: false },
    { text: "Gute Beleuchtung, klares Gesicht", met: false },
    { text: "Mindestens 30 Sekunden sprechen", met: false },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.startsWith("video/") ? "video" : "image",
      size: file.size,
      progress: 0,
      status: "uploading",
      file,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((uf) => {
      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) => {
            if (f.id === uf.id && f.status === "uploading") {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100);
              return {
                ...f,
                progress: newProgress,
                status: newProgress >= 100 ? "complete" : "uploading",
              };
            }
            return f;
          })
        );
      }, 500);

      setTimeout(() => clearInterval(interval), 3000);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const videoCount = uploadedFiles.filter(
    (f) => f.type === "video" && f.status === "complete"
  ).length;
  const imageCount = uploadedFiles.filter(
    (f) => f.type === "image" && f.status === "complete"
  ).length;

  const hasVideoFile = videoCount > 0;
  const hasVoiceRecording = voiceRecording !== null;
  const canProceed = hasVideoFile || hasVoiceRecording;

  const handleWeiter = async () => {
    if (!canProceed) return;

    setIsProcessing(true);

    try {
      // Step 1: Create avatar
      setProcessingStep("Avatar wird erstellt...");
      await api.post<Avatar>("/api/avatars", { name: "Main Avatar" });

      // Step 2: Clone voice from video or recording
      const firstVideo = uploadedFiles.find(
        (f) => f.type === "video" && f.status === "complete"
      );

      const voiceFile = hasVoiceRecording
        ? new File([voiceRecording!], "voice-recording.webm", { type: "audio/webm" })
        : firstVideo?.file;

      if (voiceFile) {
        setProcessingStep("Stimme wird geklont...");
        const formData = new FormData();
        formData.append("file", voiceFile);

        const res = await fetch(`${BASE_URL}/api/voice/clone-from-media`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (res.ok) {
          toast.success("Stimme erfolgreich geklont!");
        } else {
          const err = await res.json().catch(() => null);
          console.error("[Voice] Clone failed:", err);
          toast.error("Stimme konnte nicht geklont werden", {
            description: "Du kannst dies spater im Dashboard nachholen.",
          });
        }
      }

      navigate("/onboarding/persona");
    } catch (error) {
      toast.error("Fehler beim Erstellen", {
        description: error instanceof Error ? error.message : "Bitte versuche es erneut.",
      });
    } finally {
      setIsProcessing(false);
      setProcessingStep("");
    }
  };

  return (
    <OnboardingLayout currentStep={1}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground">
            Erstelle deinen digitalen Klon
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Lade ein Video hoch oder nimm deine Stimme auf. Wir klonen dein Aussehen und deine
            Stimme automatisch.
          </p>
        </div>

        {/* Auto-clone info */}
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">Automatisch:</span> Wenn du ein Video hochladst, klonen wir deine Stimme direkt daraus. Du musst nichts extra machen.
          </p>
        </div>

        <Tabs defaultValue="video" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="video" className="text-sm gap-2">
              <Video className="w-4 h-4" />
              Video hochladen
            </TabsTrigger>
            <TabsTrigger value="record" className="text-sm gap-2">
              <Mic className="w-4 h-4" />
              Stimme aufnehmen
            </TabsTrigger>
          </TabsList>

          {/* Video Upload Tab */}
          <TabsContent value="video" className="space-y-4 mt-6">
            <Card
              className={cn(
                "relative border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden",
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "border-border hover:border-primary/50 hover:bg-card/50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Dateien hierher ziehen oder klicken
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  MP4, MOV, WebM, JPG, PNG bis zu 500MB
                </p>
                <div className="flex justify-center gap-3">
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm border-primary/30 text-primary bg-primary/5"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Videos bevorzugt
                  </Badge>
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm border-border text-muted-foreground"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    Bilder optional
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">
                    Hochgeladene Dateien
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Video className="w-3 h-3 mr-1" />
                      {videoCount} Videos
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Image className="w-3 h-3 mr-1" />
                      {imageCount} Bilder
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  {uploadedFiles.map((file) => (
                    <Card key={file.id} className="p-4 bg-card border-border">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            file.type === "video"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent"
                          )}
                        >
                          {file.type === "video" ? (
                            <Video className="w-5 h-5" />
                          ) : (
                            <Image className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {file.status === "uploading" ? (
                            <div className="w-24">
                              <Progress value={file.progress} className="h-1.5" />
                            </div>
                          ) : null}
                          {file.status === "complete" ? (
                            <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-green-500" />
                            </div>
                          ) : null}
                          {file.status === "error" ? (
                            <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center">
                              <AlertCircle className="w-4 h-4 text-destructive" />
                            </div>
                          ) : null}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(file.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </TabsContent>

          {/* Voice Recording Tab */}
          <TabsContent value="record" className="mt-6">
            <VoiceRecorder
              onRecordingComplete={(blob) => setVoiceRecording(blob)}
              disabled={isProcessing}
            />
            {hasVoiceRecording ? (
              <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400">
                  Stimmaufnahme bereit
                </span>
              </div>
            ) : null}
          </TabsContent>
        </Tabs>

        {/* Requirements */}
        <Card className="p-6 bg-card/50 border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-primary" />
            Tipps fur optimale Ergebnisse
          </h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    req.met
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-transparent"
                  )}
                >
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-muted-foreground">{req.text}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Processing Status */}
        {isProcessing ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in duration-300">
            <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">{processingStep}</p>
              <p className="text-xs text-muted-foreground">Dies kann einen Moment dauern...</p>
            </div>
          </div>
        ) : null}

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            onClick={handleWeiter}
            disabled={!canProceed || isProcessing}
            className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {processingStep || "Verarbeite..."}
              </>
            ) : (
              <>
                Weiter
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default AvatarCreation;
