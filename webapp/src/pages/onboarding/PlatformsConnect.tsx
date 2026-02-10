import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronLeft, Instagram, MessageSquare, Eye, Pencil, Send, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cloneo_connected_platforms";

interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
  features: string[];
}

const platformConfigs: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="w-6 h-6" />,
    color: "text-pink-500",
    bgColor: "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500",
    borderColor: "border-pink-500/30 hover:border-pink-500/50",
    features: [
      "Analysiere deine bestehenden Reels",
      "Lerne deinen visuellen Stil",
      "Poste neue Reels (nach Freigabe)",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
      </svg>
    ),
    color: "text-foreground",
    bgColor: "bg-foreground",
    borderColor: "border-border hover:border-foreground/50",
    features: [
      "Analysiere deine bestehenden Videos",
      "Lerne deinen Content-Stil",
      "Poste neue Videos (nach Freigabe)",
    ],
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "text-foreground",
    bgColor: "bg-foreground",
    borderColor: "border-border hover:border-foreground/50",
    badge: "Text Posts",
    features: [
      "Analysiere deine bestehenden Tweets",
      "Lerne deinen Schreibstil",
      "Poste neue Tweets (nach Freigabe)",
    ],
  },
];

/**
 * Load connected platform IDs from localStorage.
 */
function loadConnectedPlatforms(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((v): v is string => typeof v === "string");
      }
    }
  } catch {
    // ignore corrupt data
  }
  return [];
}

/**
 * Save connected platform IDs to localStorage.
 */
function saveConnectedPlatforms(ids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

const PlatformsConnect = () => {
  const navigate = useNavigate();
  const [connectedIds, setConnectedIds] = useState<string[]>(loadConnectedPlatforms);

  // Persist to localStorage whenever the set changes
  useEffect(() => {
    saveConnectedPlatforms(connectedIds);
  }, [connectedIds]);

  const toggleConnect = (platformId: string) => {
    setConnectedIds((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const connectedCount = connectedIds.length;

  return (
    <OnboardingLayout currentStep={3}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground">
            Verbinde deine Plattformen
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Verbinde deine Social Media Accounts, damit CLONEO deinen Stil lernen kann
          </p>
        </div>

        {/* Coming Soon Notice */}
        <Card className="p-4 bg-amber-500/5 border-amber-500/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                OAuth-Verbindung kommt bald
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Echte Social-Media-Verbindungen via OAuth werden in Kurze verfugbar sein.
                Aktiviere jetzt die Plattformen, die du nutzen mochtest -- die OAuth-Einrichtung
                folgt in den Einstellungen.
              </p>
            </div>
          </div>
        </Card>

        {/* Platforms */}
        <div className="space-y-4">
          {platformConfigs.map((platform) => {
            const isConnected = connectedIds.includes(platform.id);
            return (
              <Card
                key={platform.id}
                className={cn(
                  "p-6 bg-card border-2 transition-all duration-300",
                  isConnected ? "border-primary bg-primary/5" : platform.borderColor
                )}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Platform Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0",
                        platform.bgColor
                      )}
                    >
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-foreground">{platform.name}</h3>
                        {platform.badge ? (
                          <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                            {platform.badge}
                          </Badge>
                        ) : null}
                        <Badge variant="outline" className="text-xs border-amber-500/30 text-amber-500 bg-amber-500/5">
                          Coming Soon
                        </Badge>
                        {isConnected ? (
                          <Badge className="bg-primary/10 text-primary border border-primary/30 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Vorgemerkt
                          </Badge>
                        ) : null}
                      </div>
                      <div className="mt-2 space-y-1.5">
                        {platform.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            {index === 0 ? <Eye className="w-4 h-4 shrink-0" /> : null}
                            {index === 1 ? <Pencil className="w-4 h-4 shrink-0" /> : null}
                            {index === 2 ? <Send className="w-4 h-4 shrink-0" /> : null}
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Connect Button */}
                  <div className="sm:ml-4">
                    <Button
                      variant={isConnected ? "outline" : "default"}
                      size="lg"
                      onClick={() => toggleConnect(platform.id)}
                      className={cn(
                        "w-full sm:w-auto min-w-[140px] rounded-xl transition-all",
                        isConnected
                          ? "border-primary/30 text-primary hover:bg-primary/10"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isConnected ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Vorgemerkt
                        </>
                      ) : (
                        "Vormerken"
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Info Box */}
        <Card className="p-5 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">
                Volle Kontrolle - Immer
              </h4>
              <p className="text-sm text-muted-foreground">
                CLONEO postet niemals ohne deine Freigabe. Du behaltest die volle Kontrolle uber
                jeden Inhalt, der in deinem Namen veroffentlicht wird.
              </p>
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate("/onboarding/persona")}
            className="px-6 py-6 text-base border-border hover:border-primary/30 hover:bg-card rounded-xl"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Zuruck
          </Button>
          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className={cn(
              "px-8 py-6 text-base font-semibold rounded-xl transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
            )}
          >
            Weiter
            <Check className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default PlatformsConnect;
