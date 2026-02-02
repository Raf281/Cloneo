import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Briefcase, Heart, Plane } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "10+ Hours Saved Weekly",
    description: "No more scripting, recording, editing, posting. AI handles the grind so you don't have to.",
    stat: "10+",
    statLabel: "hours/week",
  },
  {
    icon: Briefcase,
    title: "Focus on Your Business",
    description: "Spend time on what actually grows your business - products, clients, partnerships.",
    stat: "3x",
    statLabel: "more focus time",
  },
  {
    icon: Heart,
    title: "Be Present for Family",
    description: "Stop sacrificing family dinners for content creation. Your AI works while you live.",
    stat: "100%",
    statLabel: "guilt-free",
  },
  {
    icon: Plane,
    title: "True Freedom",
    description: "Travel, disconnect, take breaks. Your content keeps posting, your audience keeps growing.",
    stat: "24/7",
    statLabel: "content flow",
  },
];

const ValuePropositionSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/20 to-background pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary">
            Why Creators Choose Us
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Get Your Time Back
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            You became a creator to share your passion, not to become a video production house.
            <span className="text-foreground font-medium"> Let AI handle the content, you handle life.</span>
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <Card
              key={benefit.title}
              className="group bg-card/50 border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/80 overflow-hidden"
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Stat Section */}
                  <div className={`flex-shrink-0 w-28 md:w-36 flex flex-col items-center justify-center p-6 border-r border-border/30 ${
                    index % 2 === 0 ? 'bg-primary/5' : 'bg-accent/5'
                  }`}>
                    <span className={`font-outfit text-3xl md:text-4xl font-bold ${
                      index % 2 === 0 ? 'text-primary' : 'text-accent'
                    }`}>
                      {benefit.stat}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      {benefit.statLabel}
                    </span>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        index % 2 === 0 ? 'bg-primary/10 text-primary' : 'bg-accent/10 text-accent'
                      }`}>
                        <benefit.icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-outfit text-lg font-semibold text-foreground">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonial/Quote */}
        <div className="mt-16">
          <Card className="bg-gradient-to-br from-primary/5 via-card to-accent/5 border-border/50">
            <CardContent className="p-8 md:p-10 text-center">
              <div className="text-4xl mb-4">&ldquo;</div>
              <blockquote className="font-outfit text-xl md:text-2xl text-foreground/90 font-medium leading-relaxed max-w-3xl mx-auto">
                I used to spend 15 hours a week on content. Now I review 7 videos in 15 minutes,
                and my engagement is actually higher. I got my life back.
              </blockquote>
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-foreground">SK</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">Sarah K.</p>
                  <p className="text-xs text-muted-foreground">Lifestyle Creator, 850K followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
