import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Upload,
  Play,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  FileVideo,
  Plus,
  Loader2,
} from "lucide-react";
import { useAvatars } from "@/hooks/use-avatar";
import type { Avatar, AvatarStatus } from "@/lib/types";

// ============================================
// Status helpers
// ============================================

const statusIcons: Record<AvatarStatus, React.ReactNode> = {
  ready: <CheckCircle className="h-4 w-4 text-emerald-400" />,
  training: <Clock className="h-4 w-4 text-amber-400 animate-pulse" />,
  pending: <Clock className="h-4 w-4 text-zinc-400" />,
  failed: <AlertCircle className="h-4 w-4 text-red-400" />,
};

const statusLabels: Record<AvatarStatus, string> = {
  ready: "Bereit",
  training: "Wird trainiert",
  pending: "Ausstehend",
  failed: "Fehler",
};

const statusBadgeClasses: Record<AvatarStatus, string> = {
  ready: "bg-emerald-500/20 text-emerald-400",
  training: "bg-amber-500/20 text-amber-400",
  pending: "bg-zinc-500/20 text-zinc-400",
  failed: "bg-red-500/20 text-red-400",
};

function progressForStatus(status: AvatarStatus): number {
  switch (status) {
    case "ready":
      return 100;
    case "training":
      return 60;
    case "pending":
      return 10;
    case "failed":
      return 0;
  }
}

function progressLabel(status: AvatarStatus): string {
  switch (status) {
    case "ready":
      return "Abgeschlossen";
    case "training":
      return "In Bearbeitung...";
    case "pending":
      return "Warte auf Start";
    case "failed":
      return "Fehlgeschlagen";
  }
}

// ============================================
// Sub-components
// ============================================

function AvatarPreviewCard({ avatar }: { avatar: Avatar }) {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const progress = progressForStatus(avatar.status);

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-900/50">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Preview */}
          <div className="relative aspect-[9/16] w-full md:aspect-auto md:w-80">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=600&fit=crop"
              alt="Avatar Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-all hover:bg-white/30">
                <Play className="h-8 w-8 text-white" fill="white" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4">
              <Badge className={statusBadgeClasses[avatar.status]}>
                {statusIcons[avatar.status]}
                <span className="ml-1">{statusLabels[avatar.status]}</span>
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col p-6">
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-semibold text-white">
                {avatar.name}
              </h2>
              <p className="text-sm text-zinc-400">
                Avatar erstellt am{" "}
                {new Date(avatar.createdAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                . Status: {statusLabels[avatar.status]}.
              </p>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <p className="text-2xl font-bold text-white">
                  {avatar.status === "ready" ? "Aktiv" : "--"}
                </p>
                <p className="text-sm text-zinc-400">Modellstatus</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <p className="text-2xl font-bold text-white">
                  {avatar.heygenAvatarId ? "Ja" : "Nein"}
                </p>
                <p className="text-sm text-zinc-400">HeyGen verknupft</p>
              </div>
              <div className="rounded-lg bg-zinc-800/50 p-4">
                <p className="text-2xl font-bold text-white">
                  {avatar.voiceId ? "Ja" : "Nein"}
                </p>
                <p className="text-sm text-zinc-400">Stimme konfiguriert</p>
              </div>
            </div>

            {/* Training Status */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Trainings-Fortschritt</span>
                <span className="text-white">{progressLabel(avatar.status)}</span>
              </div>
              <Progress value={progress} className="h-2 bg-zinc-800" />
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-wrap gap-3">
              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
                    <Upload className="h-4 w-4" />
                    Trainingsmaterial hochladen
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-zinc-800 bg-zinc-950 sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-white">
                      Trainingsmaterial hochladen
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                      Lade neue Videos hoch, um deinen Avatar zu verbessern.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-700 bg-zinc-900 p-8 text-center transition-colors hover:border-violet-500/50">
                      <Upload className="mb-4 h-10 w-10 text-zinc-500" />
                      <p className="mb-2 text-sm text-white">
                        Videos hierher ziehen
                      </p>
                      <p className="mb-4 text-xs text-zinc-500">
                        MP4, MOV - Max. 500MB pro Datei
                      </p>
                      <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                        Dateien auswahlen
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-zinc-400">Tipps fur gutes Trainingsmaterial:</Label>
                      <ul className="space-y-1 text-sm text-zinc-500">
                        <li>- Gute Beleuchtung und klare Audioqualitat</li>
                        <li>- Frontale Kameraansicht</li>
                        <li>- Naturliche Sprechweise</li>
                        <li>- Mindestens 2 Minuten pro Video</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-800">
          <FileVideo className="h-8 w-8 text-violet-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">
          Noch kein Avatar erstellt
        </h3>
        <p className="mb-6 max-w-sm text-center text-sm text-zinc-400">
          Erstelle deinen ersten KI-Avatar im Onboarding, um loszulegen.
        </p>
      </CardContent>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="border-zinc-800 bg-zinc-900/50">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-400" />
        <p className="text-sm text-zinc-400">Lade Avatare...</p>
      </CardContent>
    </Card>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Card className="border-zinc-800 bg-red-950/20">
      <CardContent className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
        <h3 className="mb-2 text-lg font-semibold text-white">Fehler beim Laden</h3>
        <p className="text-sm text-zinc-400">{message}</p>
      </CardContent>
    </Card>
  );
}

// ============================================
// Main page
// ============================================

export default function AvatarManagement() {
  const { data: avatars, isLoading, isError, error } = useAvatars();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Mein Avatar</h1>
        <p className="text-zinc-400">
          Verwalte dein KI-Video-Avatar und lade neues Trainingsmaterial hoch
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState message={error?.message ?? "Unbekannter Fehler"} />
      ) : !avatars || avatars.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {avatars.map((avatar) => (
            <AvatarPreviewCard key={avatar.id} avatar={avatar} />
          ))}
        </>
      )}

      {/* Tips Card */}
      <Card className="border-zinc-800 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
              <AlertCircle className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-white">
                Verbessere die Qualitat deines Avatars
              </h3>
              <p className="text-sm text-zinc-400">
                Lade weitere Trainingsvideos hoch, um die Lippensynchronisation und
                naturliche Bewegungen zu verbessern. Je mehr Material, desto besser wird dein Avatar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
