import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Autopilot Banner */}
      <div className="relative z-10 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-primary/20 border border-accent/30 backdrop-blur-sm">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-2 h-2 bg-accent rounded-full animate-ping" />
            <div className="w-2 h-2 bg-accent rounded-full" />
          </div>
          <span className="text-sm font-medium text-foreground/90">
            Autopilot Mode
          </span>
          <Badge variant="outline" className="text-[10px] px-2 py-0 border-accent/50 text-accent bg-accent/10">
            Coming Soon
          </Badge>
        </div>
      </div>

      {/* Current Mode Badge */}
      <div className="relative z-10 mb-6 animate-in fade-in slide-in-from-top-4 duration-700 delay-100">
        <Badge className="px-4 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/30 hover:bg-primary/15">
          <Sparkles className="w-3.5 h-3.5 mr-2" />
          Review & Approve Mode - Active
        </Badge>
      </div>

      {/* Main Headline */}
      <div className="relative z-10 max-w-4xl text-center animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
        <h1 className="font-outfit text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
          <span className="text-foreground">Your AI Video Avatar</span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-x bg-clip-text text-transparent">
            Creates Content As You
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          AI creates videos with your avatar, your style, your voice.
          <span className="text-foreground font-medium"> Get your time back</span> for business, family, and the freedom you deserve.
        </p>
      </div>

      {/* Platform Pills */}
      <div className="relative z-10 mt-8 flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 backdrop-blur-sm">
          <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
            <Play className="w-2.5 h-2.5 text-white fill-white" />
          </div>
          <span className="text-sm font-medium text-foreground/80">Instagram Reels</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border/50 backdrop-blur-sm">
          <div className="w-5 h-5 rounded-lg bg-foreground flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 text-background" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
            </svg>
          </div>
          <span className="text-sm font-medium text-foreground/80">TikTok</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="relative z-10 mt-10 flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
        <Link to="/onboarding">
          <Button size="lg" className="px-8 py-6 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]">
            Start Creating Videos
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="px-8 py-6 text-base font-medium border-border/50 hover:bg-card hover:border-primary/30 rounded-xl transition-all">
          <Play className="w-5 h-5 mr-2" />
          See How It Works
        </Button>
      </div>

      {/* Premium Pricing Hint */}
      <div className="relative z-10 mt-8 text-center animate-in fade-in duration-700 delay-500">
        <p className="text-sm text-muted-foreground">
          Starting at <span className="font-semibold text-foreground">$99/month</span> for creators who value their time
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
