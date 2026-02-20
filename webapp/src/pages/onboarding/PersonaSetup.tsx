import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { User, MessageSquare, Users, Sparkles, X, Plus, ChevronRight, ChevronLeft, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { api } from "@/lib/api";
import { toast } from "sonner";
import type { Persona, CreatePersonaInput, PersonaAnalysis } from "@/lib/types";

const COMMUNICATION_STYLES = [
  { value: "motivierend", label: "Motivational", description: "Inspiring and encouraging" },
  { value: "informativ", label: "Informative", description: "Fact-based and educational" },
  { value: "unterhaltsam", label: "Entertaining", description: "Casual and humorous" },
  { value: "provokant", label: "Provocative", description: "Polarizing and controversial" },
  { value: "authentisch", label: "Authentic", description: "Honest and relatable" },
  { value: "professionell", label: "Professional", description: "Serious business tone" },
];

const PersonaSetup = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [style, setStyle] = useState("");
  const [audience, setAudience] = useState("");
  const [phrases, setPhrases] = useState("");
  const [analyzeDialogOpen, setAnalyzeDialogOpen] = useState(false);
  const [contentInput, setContentInput] = useState("");

  const savePersonaMutation = useMutation({
    mutationFn: (input: CreatePersonaInput) =>
      api.post<Persona>("/api/personas", input),
    onSuccess: () => {
      navigate("/onboarding/platforms");
    },
    onError: (error: Error) => {
      toast.error("Could not save persona", {
        description: error.message,
      });
    },
  });

  const analyzePersonaMutation = useMutation({
    mutationFn: (content: string[]) =>
      api.post<PersonaAnalysis>("/api/analyze/persona", { content }),
    onSuccess: (data) => {
      if (data.bio) setBio(data.bio);
      if (data.topics?.length) setTopics(data.topics);
      if (data.style) setStyle(data.style);
      if (data.catchphrases?.length) setPhrases(data.catchphrases.join(", "));
      if (data.targetAudience) setAudience(data.targetAudience);
      setAnalyzeDialogOpen(false);
      setContentInput("");
      toast.success("Analysis complete", {
        description: "Your persona was generated from your content.",
      });
    },
    onError: (error: Error) => {
      toast.error("Analysis failed", {
        description: error.message,
      });
    },
  });

  const addTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics((prev) => [...prev, topicInput.trim()]);
      setTopicInput("");
    }
  };

  const removeTopic = (topic: string) => {
    setTopics((prev) => prev.filter((t) => t !== topic));
  };

  const handleTopicKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTopic();
    }
  };

  const handleContinue = () => {
    const catchphrases = phrases
      .split(/[,\n]+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    const input: CreatePersonaInput = {
      bio: bio || undefined,
      topics: topics.length > 0 ? topics : undefined,
      style: style || undefined,
      catchphrases: catchphrases.length > 0 ? catchphrases : undefined,
      targetAudience: audience || undefined,
    };

    savePersonaMutation.mutate(input);
  };

  const handleAnalyze = () => {
    const contentItems = contentInput
      .split(/\n{2,}/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (contentItems.length === 0) {
      toast.error("Please add at least one post.");
      return;
    }

    analyzePersonaMutation.mutate(contentItems);
  };

  return (
    <OnboardingLayout currentStep={2}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground">
            Who Are You?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Help us understand who you are and what you do
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Bio */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-base font-medium text-foreground">
                    Bio / Description
                  </Label>
                  <p className="text-sm text-muted-foreground">Describe yourself and what you do</p>
                </div>
              </div>
              <Textarea
                id="bio"
                placeholder="I'm a fitness coach with over 10 years of experience. I help people achieve their goals and live a healthier life..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] bg-background border-border focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length} / 500 characters</p>
            </div>
          </Card>

          {/* Topics */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">Topics</Label>
                  <p className="text-sm text-muted-foreground">What do you talk about?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Fitness, Nutrition, Mindset..."
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={handleTopicKeyDown}
                  className="bg-background border-border focus:border-primary"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addTopic}
                  className="shrink-0 border-border hover:border-primary hover:bg-primary/5"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {topics.map((topic) => (
                    <Badge
                      key={topic}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                    >
                      {topic}
                      <button
                        onClick={() => removeTopic(topic)}
                        className="ml-2 hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Communication Style */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="text-base font-medium text-foreground">Communication Style</Label>
                  <p className="text-sm text-muted-foreground">What is your style?</p>
                </div>
              </div>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-background border-border focus:ring-primary">
                  <SelectValue placeholder="Choose your style..." />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{s.label}</span>
                        <span className="text-xs text-muted-foreground">{s.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Target Audience */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <Label htmlFor="audience" className="text-base font-medium text-foreground">
                    Target Audience
                  </Label>
                  <p className="text-sm text-muted-foreground">Who is your target audience?</p>
                </div>
              </div>
              <Input
                id="audience"
                placeholder="e.g. Women 25-45 who want to lose weight..."
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="bg-background border-border focus:border-primary"
              />
            </div>
          </Card>

          {/* Typical Phrases */}
          <Card className="p-6 bg-card border-border">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label htmlFor="phrases" className="text-base font-medium text-foreground">
                    Typical Phrases
                  </Label>
                  <p className="text-sm text-muted-foreground">What phrases do you use often?</p>
                </div>
              </div>
              <Textarea
                id="phrases"
                placeholder="e.g. 'Let's go!', 'You can do it!', 'No excuses!'..."
                value={phrases}
                onChange={(e) => setPhrases(e.target.value)}
                className="min-h-[100px] bg-background border-border focus:border-primary resize-none"
              />
            </div>
          </Card>

          {/* Import from Content */}
          <Dialog open={analyzeDialogOpen} onOpenChange={setAnalyzeDialogOpen}>
            <DialogTrigger asChild>
              <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Wand2 className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">Learn from Posts</h3>
                      <p className="text-sm text-muted-foreground">
                        AI analyzes your existing content automatically
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    Optional
                  </Badge>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Learn from Posts</DialogTitle>
                <DialogDescription>
                  Paste your existing content (Instagram posts, tweets, etc.).
                  Separate different posts with a blank line.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                placeholder={"Here is my first post...\n\nHere is my second post...\n\nAnd another one..."}
                value={contentInput}
                onChange={(e) => setContentInput(e.target.value)}
                className="min-h-[200px] bg-background border-border focus:border-primary resize-none"
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setAnalyzeDialogOpen(false)}
                  disabled={analyzePersonaMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzePersonaMutation.isPending || contentInput.trim().length === 0}
                >
                  {analyzePersonaMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/onboarding/avatar")}
            className="px-6 py-6 text-base border-border hover:border-primary/30 hover:bg-card rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={savePersonaMutation.isPending}
            className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            {savePersonaMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default PersonaSetup;
