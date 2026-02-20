import { useState, useEffect } from "react";
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
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { usePersona, useUpdatePersona } from "@/hooks/use-persona";
import { useToast } from "@/hooks/use-toast";

// ============================================
// Constants
// ============================================

const topicSuggestions = [
  "Productivity",
  "Mindset",
  "Entrepreneurship",
  "Self-Development",
  "Motivation",
  "Business",
  "Success",
  "Leadership",
];

const contentExamples = [
  {
    id: 1,
    text: "The difference between successful and unsuccessful people? Some talk, others act. Period.",
    engagement: "12.5k Likes",
    platform: "instagram",
  },
  {
    id: 2,
    text: "Morning routine that changed my life: Wake up at 5:30, 30min exercise, 15min meditation, 1h deep work before the world wakes up.",
    engagement: "8.2k Likes",
    platform: "tiktok",
  },
  {
    id: 3,
    text: "Unpopular opinion: Hustle culture is toxic. Work smart, not hard. Quality > Quantity.",
    engagement: "5.1k Retweets",
    platform: "x",
  },
];

// ============================================
// Sub-components
// ============================================

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="mb-4 h-10 w-10 animate-spin text-violet-400" />
      <p className="text-sm text-zinc-400">Loading persona...</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <AlertCircle className="mb-4 h-10 w-10 text-red-400" />
      <h3 className="mb-2 text-lg font-semibold text-white">Error Loading</h3>
      <p className="text-sm text-zinc-400">{message}</p>
    </div>
  );
}

// ============================================
// Main Page
// ============================================

export default function PersonaManagement() {
  const { data: persona, isLoading, isError, error } = usePersona();
  const updatePersona = useUpdatePersona();
  const { toast } = useToast();

  // ---------- Local form state ----------
  const [bio, setBio] = useState("");
  const [style, setStyle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [catchphrases, setCatchphrases] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState("");

  // Style toggles stored locally (not part of backend persona schema yet)
  const [useEmojis, setUseEmojis] = useState(true);
  const [useHashtags, setUseHashtags] = useState(true);
  const [useCta, setUseCta] = useState(true);

  // Sync backend data into local state when loaded
  useEffect(() => {
    if (persona) {
      setBio(persona.bio ?? "");
      setStyle(persona.style ?? "");
      setTargetAudience(persona.targetAudience ?? "");
      setCatchphrases((persona.catchphrases ?? []).join(", "));
      setSelectedTopics(persona.topics ?? []);
    }
  }, [persona]);

  // ---------- Topic management ----------
  const handleAddTopic = () => {
    const trimmed = newTopic.trim();
    if (trimmed && !selectedTopics.includes(trimmed)) {
      setSelectedTopics([...selectedTopics, trimmed]);
      setNewTopic("");
    }
  };

  const handleRemoveTopic = (topic: string) => {
    setSelectedTopics(selectedTopics.filter((t) => t !== topic));
  };

  // ---------- Save ----------
  const handleSave = () => {
    const catchphrasesList = catchphrases
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    updatePersona.mutate(
      {
        bio: bio || undefined,
        style: style || undefined,
        targetAudience: targetAudience || undefined,
        catchphrases: catchphrasesList.length > 0 ? catchphrasesList : undefined,
        topics: selectedTopics.length > 0 ? selectedTopics : undefined,
      },
      {
        onSuccess: () => {
          toast({
            title: "Saved",
            description: "Your persona has been successfully updated.",
          });
        },
        onError: (err) => {
          toast({
            title: "Error",
            description: err.message || "Save failed.",
            variant: "destructive",
          });
        },
      }
    );
  };

  // ---------- Loading / Error ----------
  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message={error?.message ?? "Unknown error"} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">My Persona</h1>
          <p className="text-zinc-400">
            Define your content personality and writing style
          </p>
        </div>
        <Button
          className="gap-2 bg-violet-600 hover:bg-violet-700"
          onClick={handleSave}
          disabled={updatePersona.isPending}
        >
          {updatePersona.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {updatePersona.isPending ? "Saving..." : "Save Changes"}
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
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label className="text-zinc-300">Bio / Short Description</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe yourself and what you do..."
                  className="min-h-[100px] border-zinc-700 bg-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Target Audience</Label>
                <Input
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Young entrepreneurs & ambitious professionals (25-40)"
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
                Writing Style & Tone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Primary Tone / Style</Label>
                  <Select
                    value={style || "motivational"}
                    onValueChange={(val) => setStyle(val)}
                  >
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="motivational">Motivational</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="provocative">Provocative</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Form of Address</Label>
                  <Select defaultValue="informal">
                    <SelectTrigger className="border-zinc-700 bg-zinc-800 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-zinc-700 bg-zinc-900">
                      <SelectItem value="informal">Informal (you)</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="group">Group (you all)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Typical Phrases & Expressions</Label>
                <Textarea
                  value={catchphrases}
                  onChange={(e) => setCatchphrases(e.target.value)}
                  placeholder="Comma-separated: Let's be honest..., The game-changer is..."
                  className="min-h-[80px] border-zinc-700 bg-zinc-800 text-white"
                />
              </div>

              <Separator className="bg-zinc-800" />

              <div className="space-y-4">
                <Label className="text-zinc-300">Style Settings</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Use Emojis</p>
                      <p className="text-xs text-zinc-500">
                        Include emojis in videos and posts
                      </p>
                    </div>
                    <Switch checked={useEmojis} onCheckedChange={setUseEmojis} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Generate Hashtags</p>
                      <p className="text-xs text-zinc-500">
                        Automatically add relevant hashtags
                      </p>
                    </div>
                    <Switch checked={useHashtags} onCheckedChange={setUseHashtags} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">Call-to-Action</p>
                      <p className="text-xs text-zinc-500">
                        Interaction prompt at the end
                      </p>
                    </div>
                    <Switch checked={useCta} onCheckedChange={setUseCta} />
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
                Topic Areas
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
                  placeholder="Add new topic..."
                  className="border-zinc-700 bg-zinc-800 text-white"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
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
                <p className="mb-2 text-xs text-zinc-500">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {topicSuggestions
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
          {/* Save status indicator */}
          {updatePersona.isSuccess ? (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <p className="text-sm text-emerald-400">Successfully saved</p>
              </CardContent>
            </Card>
          ) : null}

          {/* Learn from Posts */}
          <Card className="border-zinc-800 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Sparkles className="h-5 w-5 text-violet-400" />
                Learn from Posts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-400">
                Import your best social media posts so the AI can better understand your style.
              </p>
              <div className="space-y-2">
                <Input
                  placeholder="Instagram / TikTok / X URL"
                  className="border-zinc-700 bg-zinc-800 text-white"
                />
                <Button className="w-full gap-2 bg-violet-600 hover:bg-violet-700">
                  <Plus className="h-4 w-4" />
                  Add Post
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Content Examples */}
          <Card className="border-zinc-800 bg-zinc-900/50">
            <CardHeader className="border-b border-zinc-800">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <TrendingUp className="h-5 w-5 text-violet-400" />
                Reference Content
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
              <CardTitle className="text-lg text-white">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="mb-1 text-xs text-zinc-500">Detected Style</p>
                <p className="text-sm text-white">
                  {persona?.style
                    ? `${persona.style.charAt(0).toUpperCase()}${persona.style.slice(1)}`
                    : "Not yet analyzed"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-zinc-500">Topics</p>
                <p className="text-sm text-white">
                  {persona?.topics && persona.topics.length > 0
                    ? persona.topics.join(", ")
                    : "No topics defined"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-zinc-500">Recommendation</p>
                <p className="text-sm text-zinc-400">
                  Include more concrete examples and numbers for higher engagement
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
