import { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import OnboardingProgress from "./OnboardingProgress";

interface OnboardingLayoutProps {
  children: ReactNode;
  currentStep: number;
}

const STEPS = [
  { title: "Avatar", description: "Video & Images" },
  { title: "Persona", description: "Who are you?" },
  { title: "Platforms", description: "Connect" },
];

const OnboardingLayout = ({ children, currentStep }: OnboardingLayoutProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[100px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-outfit text-lg font-bold text-foreground tracking-tight">
              CLONEO
            </span>
          </Link>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </span>
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <OnboardingProgress currentStep={currentStep} totalSteps={STEPS.length} steps={STEPS} />
        </div>
      </div>

      {/* Content */}
      <main className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
