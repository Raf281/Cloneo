import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: 99,
    description: "Perfect for creators just getting started with AI video content.",
    icon: Sparkles,
    features: [
      "5 AI videos per week",
      "1 AI avatar",
      "Instagram Reels support",
      "Basic scheduling",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: 199,
    description: "For serious creators who want to maximize their content output.",
    icon: Zap,
    features: [
      "15 AI videos per week",
      "2 AI avatars",
      "Instagram Reels + TikTok",
      "Advanced scheduling",
      "Trend integration",
      "Priority support",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Agency",
    price: 299,
    description: "For agencies and creators managing multiple brands.",
    icon: Crown,
    features: [
      "Unlimited AI videos",
      "5 AI avatars",
      "All platforms",
      "White-label option",
      "Team collaboration",
      "API access",
      "Dedicated account manager",
      "Early access to Autopilot",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="relative px-6 py-24 overflow-hidden" id="pricing">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/3 to-transparent rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1.5 text-xs font-medium border-primary/30 text-primary">
            Premium Tool, Premium Value
          </Badge>
          <h2 className="font-outfit text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Invest in Your Time
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate how many hours you spend on content weekly. Now imagine getting those back.
            <span className="text-foreground font-medium"> That's the real ROI.</span>
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary/10 via-card to-card border-primary/30 scale-[1.02] shadow-xl shadow-primary/10'
                  : 'bg-card/50 border-border/50 hover:border-border hover:bg-card/80'
              }`}
            >
              {plan.popular ? (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              ) : null}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    plan.popular ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    <plan.icon className="w-5 h-5" />
                  </div>
                  {plan.popular ? (
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-4">
                  <h3 className="font-outfit text-xl font-bold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-1">
                    <span className="font-outfit text-4xl font-bold text-foreground">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  className={`w-full mb-6 rounded-xl py-6 ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {plan.cta}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'bg-primary/20' : 'bg-primary/10'
                      }`}>
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border/50">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">14-day free trial</span> on all plans. No credit card required.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
