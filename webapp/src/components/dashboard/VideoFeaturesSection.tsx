import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mic, Palette, Brain, Video, Sparkles } from "lucide-react";

const features = [
  {
    icon: User,
    title: "Your AI Avatar",
    description: "A digital twin that looks exactly like you. Your face, your expressions, your unique presence.",
    highlight: "Core Feature",
  },
  {
    icon: Mic,
    title: "Your Voice Clone",
    description: "AI speaks with your actual voice - your tone, your cadence, your personality shines through.",
    highlight: null,
  },
  {
    icon: Palette,
    title: "Your Visual Style",
    description: "Consistent aesthetic across all videos. Colors, fonts, and editing style that define your brand.",
    highlight: null,
  },
  {
    icon: Brain,
    title: "Your Persona",
    description: "AI understands your niche, your audience, and creates content that sounds authentically you.",
    highlight: null,
  },
  {
    icon: Video,
    title: "Video-First Content",
    description: "Optimized for Instagram Reels and TikTok. Vertical format, trending hooks, perfect timing.",
    highlight: null,
  },
  {
    icon: Sparkles,
    title: "Consistent Quality",
    description: "Every video maintains your standards. Professional lighting, crisp audio, polished editing.",
    highlight: null,
  },
];

const VideoFeaturesSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-accent/30 text-accent">
            The Virtual You
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Your AI Video Avatar
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Not just any AI. An AI that <span className="text-foreground font-medium">is</span> you.
            Your audience sees you, hears you, connects with you.
          </p>
        </div>

        {/* Avatar Preview Card */}
        <div className="mb-16">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card via-card to-card/50 border-border/50 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Visual Side */}
                <div className="relative aspect-[9/16] md:aspect-auto bg-gradient-to-br from-primary/10 via-accent/5 to-background flex items-center justify-center p-8">
                  <div className="relative">
                    {/* Avatar Placeholder */}
                    <div className="w-48 h-64 md:w-56 md:h-72 rounded-2xl bg-gradient-to-b from-card to-secondary border border-border/50 flex flex-col items-center justify-center gap-4 shadow-2xl">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <User className="w-10 h-10 text-foreground/50" />
                      </div>
                      <div className="text-center px-4">
                        <p className="text-xs text-muted-foreground">Your AI Avatar</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">Looks & sounds like you</p>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <div className="absolute -top-3 -right-3 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium shadow-lg">
                      Recording...
                    </div>
                    <div className="absolute -bottom-3 -left-3 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground shadow-lg flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      HD Quality
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h3 className="font-outfit text-2xl font-bold text-foreground mb-4">
                    The Core of CreatorAI
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    Your video avatar is not a generic AI face. It's trained specifically on you - capturing your likeness, mannerisms, and vocal patterns to create content that's indistinguishable from you recording it yourself.
                  </p>
                  <ul className="space-y-3">
                    {['Trained on your face & expressions', 'Cloned from your voice recordings', 'Matches your speaking style', 'Consistent across all content'].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-foreground/80">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/80"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/15 transition-colors">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  {feature.highlight ? (
                    <Badge className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent border border-accent/30">
                      {feature.highlight}
                    </Badge>
                  ) : null}
                </div>
                <h3 className="font-outfit text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoFeaturesSection;
