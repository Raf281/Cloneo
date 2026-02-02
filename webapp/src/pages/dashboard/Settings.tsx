import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Link2,
  Globe,
  Moon,
  Mail,
  Smartphone,
  Instagram,
  Check,
  ExternalLink,
  Trash2,
  Clock,
  Hash,
  Calendar,
  Zap,
} from "lucide-react";
import { XIcon } from "@/components/x-posts";

// TikTok icon component
function TikTokIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const connectedPlatforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    connected: true,
    username: "@johndoe",
    color: "text-pink-400",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: TikTokIcon,
    connected: true,
    username: "@johndoe_content",
    color: "text-cyan-400",
  },
  {
    id: "x",
    name: "X (Twitter)",
    icon: XIcon,
    connected: true,
    username: "@johndoe_official",
    color: "text-white",
  },
];

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // X/Twitter specific settings
  const [xAutoPost, setXAutoPost] = useState(false);
  const [xIncludeHashtags, setXIncludeHashtags] = useState(true);
  const [xAutoThread, setXAutoThread] = useState(false);
  const [xDefaultTone, setXDefaultTone] = useState("motivational");
  const [xPostingSchedule, setXPostingSchedule] = useState("optimal");
  const [xHashtagStyle, setXHashtagStyle] = useState("moderate");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white md:text-3xl">Einstellungen</h1>
        <p className="text-zinc-400">Verwalte dein Konto und deine Praferenzen</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Settings */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Settings */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <User className="h-5 w-5 text-violet-400" />
                Konto
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Deine personlichen Kontoinformationen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Vorname</Label>
                  <Input
                    defaultValue="John"
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Nachname</Label>
                  <Input
                    defaultValue="Doe"
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">E-Mail</Label>
                <Input
                  type="email"
                  defaultValue="john@example.com"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
              <Button className="bg-violet-600 hover:bg-violet-700">
                Anderungen speichern
              </Button>
            </CardContent>
          </Card>

          {/* X/Twitter Settings - NEW PROMINENT SECTION */}
          <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900 to-black">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black border border-zinc-700">
                  <XIcon className="h-4 w-4 text-white" />
                </div>
                X (Twitter) Einstellungen
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Konfiguriere deine X/Twitter Veroffentlichungs-Praferenzen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              {/* Connection Status */}
              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <div className="flex items-center gap-3">
                  <XIcon className="h-5 w-5 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">@johndoe_official</p>
                    <p className="text-xs text-zinc-500">Verbunden seit Jan 2025</p>
                  </div>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  <Check className="mr-1 h-3 w-3" />
                  Verbunden
                </Badge>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Auto-Posting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Posting aktivieren</p>
                    <p className="text-xs text-zinc-500">
                      Freigegebene Posts automatisch veroffentlichen
                    </p>
                  </div>
                </div>
                <Switch checked={xAutoPost} onCheckedChange={setXAutoPost} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Posting Schedule */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-zinc-400" />
                  <Label className="text-zinc-300">Posting-Zeitplan</Label>
                </div>
                <Select value={xPostingSchedule} onValueChange={setXPostingSchedule}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="optimal">
                      <span className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-emerald-400" />
                        Optimale Zeiten (KI-empfohlen)
                      </span>
                    </SelectItem>
                    <SelectItem value="morning">Morgens (8:00 - 10:00)</SelectItem>
                    <SelectItem value="midday">Mittags (12:00 - 14:00)</SelectItem>
                    <SelectItem value="evening">Abends (18:00 - 20:00)</SelectItem>
                    <SelectItem value="night">Spatabends (21:00 - 23:00)</SelectItem>
                    <SelectItem value="custom">Benutzerdefiniert</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-zinc-500">
                  {xPostingSchedule === "optimal"
                    ? "KI analysiert deine Follower-Aktivitat fur beste Reichweite"
                    : "Deine Posts werden zur ausgewahlten Zeit veroffentlicht"}
                </p>
              </div>

              <Separator className="bg-zinc-800" />

              {/* Hashtag Preferences */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-zinc-400" />
                  <Label className="text-zinc-300">Hashtag-Praferenzen</Label>
                </div>
                <Select value={xHashtagStyle} onValueChange={setXHashtagStyle}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="none">Keine Hashtags</SelectItem>
                    <SelectItem value="minimal">Minimal (1-2 Hashtags)</SelectItem>
                    <SelectItem value="moderate">Moderat (3-5 Hashtags)</SelectItem>
                    <SelectItem value="aggressive">Aggressiv (5-10 Hashtags)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Hashtags automatisch einfugen</p>
                    <p className="text-xs text-zinc-500">
                      KI schlagt relevante Hashtags vor
                    </p>
                  </div>
                </div>
                <Switch checked={xIncludeHashtags} onCheckedChange={setXIncludeHashtags} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Thread Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Auto-Thread fur lange Inhalte</p>
                    <p className="text-xs text-zinc-500">
                      Automatisch Threads erstellen wenn Text zu lang
                    </p>
                  </div>
                </div>
                <Switch checked={xAutoThread} onCheckedChange={setXAutoThread} />
              </div>

              <Separator className="bg-zinc-800" />

              {/* Default Tone */}
              <div className="space-y-3">
                <Label className="text-zinc-300">Standard-Tonalitat fur X Posts</Label>
                <Select value={xDefaultTone} onValueChange={setXDefaultTone}>
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="motivational">Motivierend</SelectItem>
                    <SelectItem value="educational">Lehrreich</SelectItem>
                    <SelectItem value="entertaining">Unterhaltsam</SelectItem>
                    <SelectItem value="controversial">Kontrovers</SelectItem>
                    <SelectItem value="storytelling">Storytelling</SelectItem>
                    <SelectItem value="professional">Professionell</SelectItem>
                    <SelectItem value="casual">Locker</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full gap-2 bg-black text-white hover:bg-zinc-900">
                <XIcon className="h-4 w-4" />
                X Einstellungen speichern
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Bell className="h-5 w-5 text-violet-400" />
                Benachrichtigungen
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Wie und wann du benachrichtigt werden mochtest
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">E-Mail Benachrichtigungen</p>
                    <p className="text-xs text-zinc-500">
                      Erhalte Updates per E-Mail
                    </p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Push Benachrichtigungen</p>
                    <p className="text-xs text-zinc-500">
                      Benachrichtigungen auf deinem Gerat
                    </p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Wochentlicher Report</p>
                    <p className="text-xs text-zinc-500">
                      Zusammenfassung deiner Content Performance
                    </p>
                  </div>
                </div>
                <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
              </div>
            </CardContent>
          </Card>

          {/* Connected Platforms */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Link2 className="h-5 w-5 text-violet-400" />
                Verbundene Plattformen
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Verwalte deine Social Media Verbindungen
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800">
                {connectedPlatforms.map((platform) => (
                  <div key={platform.id} className="flex items-center gap-4 p-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      platform.id === "x" ? "bg-black" : ""
                    } ${platform.color}`}>
                      <platform.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{platform.name}</p>
                      {platform.connected ? (
                        <p className="text-xs text-zinc-500">{platform.username}</p>
                      ) : (
                        <p className="text-xs text-zinc-500">Nicht verbunden</p>
                      )}
                    </div>
                    {platform.connected ? (
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          <Check className="mr-1 h-3 w-3" />
                          Verbunden
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-zinc-400 hover:text-red-400"
                        >
                          Trennen
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verbinden
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Globe className="h-5 w-5 text-violet-400" />
                Veroffentlichung
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Einstellungen fur die Content-Veroffentlichung
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Auto-Publish</p>
                  <p className="text-xs text-zinc-500">
                    Freigegebenen Content automatisch veroffentlichen
                  </p>
                </div>
                <Switch checked={autoPublish} onCheckedChange={setAutoPublish} />
              </div>
              <Separator className="bg-zinc-800" />
              <div className="space-y-2">
                <Label className="text-zinc-300">Standard Zeitzone</Label>
                <Select defaultValue="europe-berlin">
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="europe-berlin">Europe/Berlin (CET)</SelectItem>
                    <SelectItem value="europe-london">Europe/London (GMT)</SelectItem>
                    <SelectItem value="america-new-york">America/New York (EST)</SelectItem>
                    <SelectItem value="america-los-angeles">
                      America/Los Angeles (PST)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-zinc-300">Sprache</Label>
                <Select defaultValue="de">
                  <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-zinc-700 bg-zinc-900">
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Plan Info */}
          <Card className="border-zinc-800 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <CreditCard className="h-5 w-5 text-violet-400" />
                Dein Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Aktueller Plan</span>
                <Badge className="bg-violet-500/20 text-violet-400">Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Content / Monat</span>
                <span className="text-white">45 / 50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Nachste Abrechnung</span>
                <span className="text-white">15. Marz 2025</span>
              </div>
              <Separator className="bg-zinc-700" />
              <Button
                variant="outline"
                className="w-full border-violet-500/50 text-violet-400 hover:bg-violet-500/10"
              >
                Plan upgraden
              </Button>
            </CardContent>
          </Card>

          {/* X Stats Quick View */}
          <Card className="border-zinc-800 bg-black">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <XIcon className="h-5 w-5" />
                X Ubersicht
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Posts diese Woche</span>
                <span className="text-white font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Threads</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Geplant</span>
                <span className="text-blue-400 font-semibold">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Warten auf Review</span>
                <span className="text-amber-400 font-semibold">2</span>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Moon className="h-5 w-5 text-violet-400" />
                Erscheinungsbild
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Dark Mode</p>
                  <p className="text-xs text-zinc-500">Dunkles Design verwenden</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Shield className="h-5 w-5 text-violet-400" />
                Sicherheit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                Passwort andern
              </Button>
              <Button
                variant="outline"
                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                2-Faktor-Authentifizierung
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-lg text-red-400">Gefahrenzone</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                    Konto loschen
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-zinc-800 bg-zinc-950">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">
                      Bist du sicher?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-zinc-400">
                      Diese Aktion kann nicht ruckgangig gemacht werden. Alle deine Daten,
                      dein Avatar und dein Content werden unwiderruflich geloscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                      Abbrechen
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Konto loschen
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
