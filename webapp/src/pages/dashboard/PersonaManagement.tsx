import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  RefreshCw,
  Sparkles,
  FileText,
  MessageSquare,
  TrendingUp,
  Lightbulb,
  Plus,
  X,
  ExternalLink,
} from "lucide-react";

const contentExamples = [
  {
    id: 1,
    text: "Der Unterschied zwischen erfolgreichen und erfolglosen Menschen? Die einen reden, die anderen handeln. Punkt.",
    engagement: "12.5k Likes",
    platform: "instagram",
  },
  {
    id: 2,
    text: "Morning Routine die mein Leben verandert hat: 5:30 aufstehen, 30min Sport, 15min Meditation, 1h Deep Work bevor die Welt aufwacht.",
    engagement: "8.2k Likes",
    platform: "tiktok",
  },
  {
    id: 3,
    text: "Unpopuläre Meinung: Hustle Culture ist toxisch. Arbeite smart, nicht hard. Qualität > Quantität.",
    engagement: "5.1k Retweets",
    platform: "x",
  },
];

const topicTags = [
  "Produktivitat",
  "Mindset",
  "Entrepreneurship",
  "Selbstentwicklung",
  "Motivation",
  "Business",
  "Erfolg",
  "Leadership",
];

export default function PersonaManagement() {
  const [isLearning, setIsLearning] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "Produktivitat",
    "Mindset",
    "Entrepreneurship",
  ]);
  const [newTopic, setNewTopic] = useState("");

  const handleAddTopic = () => {
    if (newTopic && !selectedTopics.includes(newTopic)) {
      setSelectedTopics([...selectedTopics, newTopic]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  const handleLearnFromPosts = () => {
    setIsLearning(true);
    setTimeout(() => setIsLearning(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Meine Persona</h1>
          <p className="text-zinc-400">
            Definiere deine Content-Personlichkeit und Schreibstil
          </p>
        </div>
        <Button className="gap-2 bg-violet-600 hover:bg-violet-700">
          <Save className="h-4 w-4" />
          Anderungen speichern
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Info */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <FileText className="h-5 w-5 text-violet-400" />
                Grundinformationen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Name / Alias</Label>
                  <Input
                    defaultValue="John Doe"
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Rolle / Titel</Label>
                  <Input
                    defaultValue="Unternehmer & Content Creator"
                    className="border-zinc-700 bg-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Bio / Kurzbeschreibung</Label>
                <Textarea
                  defaultValue="Ich helfe Menschen dabei, produktiver zu werden und ihre Ziele zu erreichen. Nach 10 Jahren im Business teile ich meine besten Strategien und Learnings."
                  className="min-h-[100px] border-zinc-700 bg-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Zielgruppe</Label>
                <Input
                  defaultValue="Junge Unternehmer & ambitionierte Professionals (25-40)"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Writing Style */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <MessageSquare className="h-5 w-5 text-violet-400" />
                Schreibstil & Tonalitat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Haupt-Tonalitat</Label>
                  <Select defaultValue="motivational">
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="motivational">Motivierend</SelectItem>
                      <SelectItem value="educational">Lehrreich</SelectItem>
                      <SelectItem value="provocative">Provokativ</SelectItem>
                      <SelectItem value="casual">Locker/Casual</SelectItem>
                      <SelectItem value="professional">Professionell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Ansprache</Label>
                  <Select defaultValue="du">
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="du">Du (informell)</SelectItem>
                      <SelectItem value="sie">Sie (formell)</SelectItem>
                      <SelectItem value="ihr">Ihr (Gruppe)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Typische Phrasen & Ausdrucke</Label>
                <Textarea
                  defaultValue="Lass uns ehrlich sein..., Der Game-Changer ist..., Das ist der Punkt wo die meisten aufgeben..., Fakt ist..."
                  placeholder="Phrasen die du oft verwendest..."
                  className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white"
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-4">
                <Label className="text-zinc-300">Stil-Einstellungen</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Emojis verwenden</p>
                      <p className="text-xs text-zinc-500">
                        Emojis in Videos und Posts einfugen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Hashtags generieren</p>
                      <p className="text-xs text-zinc-500">
                        Automatisch relevante Hashtags hinzufugen
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Call-to-Action</p>
                      <p className="text-xs text-zinc-500">
                        Aufforderung zur Interaktion am Ende
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Topics */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Lightbulb className="h-5 w-5 text-violet-400" />
                Themengebiete
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="flex flex-wrap gap-2">
                {selectedTopics.map((topic) => (
                  <Badge
                    key={topic}
                    className="gap-1 bg-violet-500/20 text-violet-400 hover:bg-violet-500/30"
                  >
                    {topic}
                    <button
                      onClick={() => handleRemoveTopic(topic)}
                      className="ml-1 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="Neues Thema hinzufugen..."
                  className="border-zinc-700 bg-zinc-800 text-white"
                  onKeyDown={(e) => e.key === "Enter" && handleAddTopic()}
                />
                <Button
                  onClick={handleAddTopic}
                  variant="outline"
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <p className="mb-2 text-xs text-zinc-500">Vorschlage:</p>
                <div className="flex flex-wrap gap-2">
                  {topicTags
                    .filter((t) => !selectedTopics.includes(t))
                    .map((topic) => (
                      <button
                        key={topic}
                        onClick={() => setSelectedTopics([...selectedTopics, topic])}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400 transition-colors hover:border-violet-500/50 hover:bg-violet-500/10 hover:text-violet-400"
                      >
                        + {topic}
                      </button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learn from Posts */}
          <Card className="border-zinc-800 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Sparkles className="h-5 w-5 text-violet-400" />
                Aus Beitragen lernen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Importiere deine besten Social-Media-Beitrage, damit die KI deinen Stil besser versteht.
              </p>
              <div className="space-y-2">
                <Input
                  placeholder="Instagram / TikTok / X URL"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
                <Button
                  className="w-full gap-2 bg-violet-600 hover:bg-violet-700"
                  onClick={handleLearnFromPosts}
                  disabled={isLearning}
                >
                  {isLearning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Analysiere...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Beitrag hinzufugen
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Examples */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <TrendingUp className="h-5 w-5 text-violet-400" />
                Referenz-Content
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800">
                {contentExamples.map((example) => (
                  <div key={example.id} className="p-4">
                    <p className="mb-2 text-sm text-zinc-300">{example.text}</p>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-zinc-800 text-zinc-400">
                        {example.engagement}
                      </Badge>
                      <button className="text-zinc-500 hover:text-violet-400">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="text-lg text-white">KI-Analyse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="mb-1 text-xs text-zinc-500">Erkannter Stil</p>
                <p className="text-sm text-white">
                  Direkt, motivierend, mit kurzen pragnanten Satzen
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-zinc-500">Starken</p>
                <p className="text-sm text-white">
                  Storytelling, emotionale Hooks, klare CTAs
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-zinc-500">Empfehlung</p>
                <p className="text-sm text-zinc-400">
                  Mehr konkrete Beispiele und Zahlen einbauen fur hoheres Engagement
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
