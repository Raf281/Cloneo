import { Sparkles, Play } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative px-6 py-16 border-t border-border/30">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-outfit text-lg font-bold text-foreground tracking-tight">
                CreatorAI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              AI creates videos AS you. Your avatar, your style, your voice.
              Get more time for business, family, and the freedom you deserve.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                  <Play className="w-2 h-2 text-white fill-white" />
                </div>
                Instagram Reels
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border/50 text-xs text-muted-foreground">
                <div className="w-4 h-4 rounded-md bg-foreground flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-2 h-2 text-background" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                </div>
                TikTok
              </div>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-outfit font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Roadmap', 'API'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-outfit font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            2026 CreatorAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service'].map((item) => (
              <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
