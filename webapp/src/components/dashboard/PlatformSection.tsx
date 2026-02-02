import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, Users, Zap } from "lucide-react";

const PlatformSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary">
            Platform Focus
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Built for Short-Form Video
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Optimized specifically for the platforms that matter most to creators right now.
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Instagram Reels */}
          <Card className="group relative bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-pink-500/30 hover:bg-card/80">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-8">
              {/* Platform Icon */}
              <div className="mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-bold text-foreground">Instagram Reels</h3>
                  <p className="text-sm text-muted-foreground">Primary Platform</p>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3">
                {[
                  { icon: TrendingUp, text: "Algorithm-optimized hooks & trends" },
                  { icon: Users, text: "Perfect aspect ratio & formatting" },
                  { icon: Zap, text: "Auto-scheduling at peak times" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-pink-500" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>

              {/* Status Badge */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <Badge className="bg-green-500/10 text-green-500 border border-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Fully Supported
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* TikTok */}
          <Card className="group relative bg-card/50 border-border/50 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-foreground/30 hover:bg-card/80">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-8">
              {/* Platform Icon */}
              <div className="mb-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-background" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-outfit text-xl font-bold text-foreground">TikTok</h3>
                  <p className="text-sm text-muted-foreground">Primary Platform</p>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3">
                {[
                  { icon: TrendingUp, text: "Trending sounds & effects integration" },
                  { icon: Users, text: "FYP-optimized content structure" },
                  { icon: Zap, text: "Cross-post ready formatting" },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm text-foreground/80">
                    <div className="w-7 h-7 rounded-lg bg-foreground/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-3.5 h-3.5 text-foreground" />
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>

              {/* Status Badge */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <Badge className="bg-green-500/10 text-green-500 border border-green-500/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                  Fully Supported
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Focus Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-2xl bg-card border border-border/50">
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-foreground">Video-First Approach</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-border" />
            <span className="text-sm text-muted-foreground">
              100% focused on video content. Your avatar. Your voice. Your videos.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlatformSection;
