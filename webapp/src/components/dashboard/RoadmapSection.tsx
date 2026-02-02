import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rocket, Bot, MessageSquare, Zap, Lock } from "lucide-react";

const roadmapItems = [
  {
    icon: Bot,
    title: "Full Autopilot Mode",
    description: "Zero intervention required. AI handles everything from ideation to posting. You just watch your audience grow.",
    status: "in_development",
    statusLabel: "In Development & Testing",
    timeline: "Q1 2026",
    highlight: true,
  },
  {
    icon: MessageSquare,
    title: "X/Twitter Integration",
    description: "AI-generated text posts that match your persona. Extend your reach beyond video to text-based engagement.",
    status: "planned",
    statusLabel: "Planned",
    timeline: "Q2 2026",
    highlight: false,
  },
  {
    icon: Zap,
    title: "Real-time Trend Response",
    description: "AI monitors trends in your niche and creates timely content to capitalize on viral moments.",
    status: "planned",
    statusLabel: "Planned",
    timeline: "Q2 2026",
    highlight: false,
  },
  {
    icon: Lock,
    title: "Advanced Analytics",
    description: "Deep insights into what content performs best for your avatar, with AI-driven optimization suggestions.",
    status: "planned",
    statusLabel: "Planned",
    timeline: "Q3 2026",
    highlight: false,
  },
];

const RoadmapSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-accent/30 text-accent">
            <Rocket className="w-3.5 h-3.5 mr-2" />
            Product Roadmap
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Coming Soon
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're constantly building. Here's what's next on the horizon.
          </p>
        </div>

        {/* Roadmap Timeline */}
        <div className="space-y-6">
          {roadmapItems.map((item, index) => (
            <Card
              key={item.title}
              className={`group relative overflow-hidden transition-all duration-300 ${
                item.highlight
                  ? 'bg-gradient-to-r from-accent/10 via-card to-primary/10 border-accent/30 hover:border-accent/50'
                  : 'bg-card/50 border-border/50 hover:border-border hover:bg-card/80'
              }`}
            >
              {item.highlight ? (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-accent" />
              ) : null}

              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon & Timeline */}
                  <div className="flex md:flex-col items-center gap-4 md:w-24">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.highlight
                        ? 'bg-accent/20 text-accent'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      {item.timeline}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="font-outfit text-xl font-bold text-foreground">
                        {item.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-2 py-0.5 ${
                          item.status === 'in_development'
                            ? 'border-accent/50 text-accent bg-accent/10'
                            : 'border-muted-foreground/30 text-muted-foreground'
                        }`}
                      >
                        {item.status === 'in_development' ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
                        ) : null}
                        {item.statusLabel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Index Number */}
                  <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full border border-border/50 text-muted-foreground/50 font-mono text-sm">
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Join Early Note */}
        <div className="mt-12 text-center">
          <Card className="inline-block bg-card/50 border-border/50">
            <CardContent className="px-8 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Join Early, Shape the Future</p>
                <p className="text-xs text-muted-foreground">Early adopters get input on feature priorities</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
