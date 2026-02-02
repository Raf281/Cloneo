import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare, Users, Sparkles, X, Plus, ChevronRight, ChevronLeft, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";

const COMMUNICATION_STYLES = [
  { value: "motivierend", label: "Motivierend", description: "Inspirierend und aufmunternd" },
  { value: "informativ", label: "Informativ", description: "Faktenbasiert und lehrreich" },
  { value: "unterhaltsam", label: "Unterhaltsam", description: "Locker und humorvoll" },
  { value: "provokant", label: "Provokant", description: "Polarisierend und kontrovers" },
  { value: "authentisch", label: "Authentisch", description: "Ehrlich und nahbar" },
  { value: "professionell", label: "Professionell", description: "Serioser Business-Ton" },
];

const PersonaSetup = () => {
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState("");
  const [style, setStyle] = useState("");
  const [audience, setAudience] = useState("");
  const [phrases, setPhrases] = useState("");

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

  return (
    <OnboardingLayout currentStep={2}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground">
            Wer bist du?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Hilf uns zu verstehen, wer du bist und was du machst
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
                    Bio / Beschreibung
                  </Label>
                  <p className="text-sm text-muted-foreground">Beschreibe dich und was du machst</p>
                </div>
              </div>
              <Textarea
                id="bio"
                placeholder="Ich bin ein Fitness-Coach mit uber 10 Jahren Erfahrung. Ich helfe Menschen dabei, ihre Ziele zu erreichen und ein gesunderes Leben zu fuhren..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] bg-background border-border focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{bio.length} / 500 Zeichen</p>
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
                  <Label className="text-base font-medium text-foreground">Themen</Label>
                  <p className="text-sm text-muted-foreground">Woruber sprichst du?</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="z.B. Fitness, Ernahrung, Mindset..."
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
                  <Label className="text-base font-medium text-foreground">Kommunikationsstil</Label>
                  <p className="text-sm text-muted-foreground">Wie ist dein Stil?</p>
                </div>
              </div>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="bg-background border-border focus:ring-primary">
                  <SelectValue placeholder="Wahle deinen Stil..." />
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
                    Zielgruppe
                  </Label>
                  <p className="text-sm text-muted-foreground">Wer ist deine Zielgruppe?</p>
                </div>
              </div>
              <Input
                id="audience"
                placeholder="z.B. Frauen 25-45, die abnehmen wollen..."
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
                    Typische Redewendungen
                  </Label>
                  <p className="text-sm text-muted-foreground">Welche Phrasen verwendest du oft?</p>
                </div>
              </div>
              <Textarea
                id="phrases"
                placeholder="z.B. 'Let's go!', 'Das kannst du schaffen!', 'Kein Excuses!'..."
                value={phrases}
                onChange={(e) => setPhrases(e.target.value)}
                className="min-h-[100px] bg-background border-border focus:border-primary resize-none"
              />
            </div>
          </Card>

          {/* Import from Content */}
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Aus Beitragen lernen</h3>
                  <p className="text-sm text-muted-foreground">
                    KI analysiert deine bestehenden Inhalte automatisch
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary">
                Optional
              </Badge>
            </div>
          </Card>
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
            Zuruck
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/onboarding/platforms")}
            className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
          >
            Weiter
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default PersonaSetup;
