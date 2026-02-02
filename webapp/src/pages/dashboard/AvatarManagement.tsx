import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Trash2,
  Plus,
} from "lucide-react";

const trainingVideos = [
  {
    id: 1,
    name: "Intro_Video_1.mp4",
    duration: "2:34",
    uploadedAt: "vor 3 Tagen",
    status: "processed",
  },
  {
    id: 2,
    name: "Speaking_Sample.mp4",
    duration: "1:45",
    uploadedAt: "vor 3 Tagen",
    status: "processed",
  },
  {
    id: 3,
    name: "Presentation_Clip.mp4",
    duration: "3:12",
    uploadedAt: "vor 2 Tagen",
    status: "processed",
  },
  {
    id: 4,
    name: "Casual_Talk.mp4",
    duration: "4:20",
    uploadedAt: "vor 1 Tag",
    status: "processing",
  },
];

const statusIcons: Record<string, React.ReactNode> = {
  processed: <CheckCircle className="h-4 w-4 text-emerald-400" />,
  processing: <Clock className="h-4 w-4 text-amber-400 animate-pulse" />,
  error: <AlertCircle className="h-4 w-4 text-red-400" />,
};

const statusLabels: Record<string, string> = {
  processed: "Verarbeitet",
  processing: "Wird verarbeitet",
  error: "Fehler",
};

export default function AvatarManagement() {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Mein Avatar</h1>
        <p className="text-zinc-400">
          Verwalte dein KI-Video-Avatar und lade neues Trainingsmaterial hoch
        </p>
      </div>

      {/* Avatar Preview Card */}
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
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Bereit
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold text-white">
                  Dein Video-Avatar
                </h2>
                <p className="text-sm text-zinc-400">
                  Dein Avatar wurde erfolgreich trainiert und ist bereit, Videos zu erstellen.
                  Das Modell basiert auf {trainingVideos.length} Trainingsvideos.
                </p>
              </div>

              {/* Stats */}
              <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-sm text-zinc-400">Trainingsvideos</p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <p className="text-2xl font-bold text-white">11:51</p>
                  <p className="text-sm text-zinc-400">Gesamtlange</p>
                </div>
                <div className="rounded-lg bg-zinc-800/50 p-4">
                  <p className="text-2xl font-bold text-white">98%</p>
                  <p className="text-sm text-zinc-400">Qualitat</p>
                </div>
              </div>

              {/* Training Status */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Trainings-Fortschritt</span>
                  <span className="text-white">Abgeschlossen</span>
                </div>
                <Progress value={100} className="h-2 bg-zinc-800" />
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

                <Button
                  variant="outline"
                  className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  <RefreshCw className={`h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
                  {isRegenerating ? "Wird regeneriert..." : "Avatar regenerieren"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training Material */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800">
          <CardTitle className="text-lg text-white">Trainingsmaterial</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-zinc-400 hover:text-white"
            onClick={() => setUploadDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Hinzufugen
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-800">
            {trainingVideos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-zinc-800/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800">
                  <FileVideo className="h-6 w-6 text-violet-400" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-white">{video.name}</p>
                  <p className="text-xs text-zinc-500">
                    {video.duration} - {video.uploadedAt}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {statusIcons[video.status]}
                    <span className="text-xs text-zinc-400">
                      {statusLabels[video.status]}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-zinc-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
