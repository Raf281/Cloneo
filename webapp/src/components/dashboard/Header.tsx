import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 py-3 rounded-2xl bg-card/80 border border-border/50 backdrop-blur-md">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-outfit text-lg font-bold text-foreground tracking-tight">
              CreatorAI
            </span>
          </div>

          {/* Center Nav - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {['Features', 'How It Works', 'Pricing', 'Roadmap'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-primary/5"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="hidden sm:flex px-3 py-1 text-xs border-primary/30 text-primary">
              Review & Approve
            </Badge>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
