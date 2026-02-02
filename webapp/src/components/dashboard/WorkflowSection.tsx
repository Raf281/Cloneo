import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Video, CheckCircle2, Calendar, ArrowRight } from "lucide-react";

const workflowSteps = [
  {
    step: 1,
    icon: Lightbulb,
    title: "AI Generates Ideas",
    description: "Based on your persona and niche, AI creates video content ideas tailored to your audience",
    status: "automated",
  },
  {
    step: 2,
    icon: Video,
    title: "AI Creates Video",
    description: "Your AI avatar records the video - your look, your style, your voice, your personality",
    status: "automated",
  },
  {
    step: 3,
    icon: CheckCircle2,
    title: "You Review & Approve",
    description: "Watch the video, make edits if needed, and approve when you're happy with it",
    status: "you",
  },
  {
    step: 4,
    icon: Calendar,
    title: "Schedule & Post",
    description: "Set the perfect time and let the system handle posting to Instagram Reels & TikTok",
    status: "automated",
  },
];

const WorkflowSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Section Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary">
            How It Works
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Review & Approve Workflow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            You stay in control. AI does the heavy lifting while you make the final call.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, index) => (
            <div key={step.step} className="relative group">
              {/* Connector Line */}
              {index < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[calc(100%+12px)] w-[calc(100%-24px)] h-[2px]">
                  <div className="h-full bg-gradient-to-r from-border via-primary/30 to-border" />
                  <ArrowRight className="absolute -right-1 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                </div>
              )}

              <Card className="h-full bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/5 group-hover:scale-[1.02]">
                <CardContent className="p-6">
                  {/* Step Number & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm font-mono">
                      {step.step.toString().padStart(2, '0')}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 ${
                        step.status === 'you'
                          ? 'border-accent/50 text-accent bg-accent/10'
                          : 'border-primary/30 text-primary/70 bg-primary/5'
                      }`}
                    >
                      {step.status === 'you' ? 'Your Action' : 'AI Powered'}
                    </Badge>
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    step.status === 'you'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <step.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <h3 className="font-outfit text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Workflow Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              Average time to review: <span className="font-semibold text-foreground">2 minutes per video</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
