import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import type { OnboardingStatus, ContentStats } from "@/lib/types";
import {
  Check,
  User,
  Sparkles,
  FileVideo,
  Share2,
  ChevronRight,
  X,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
  href: string;
  action: string;
}

export function GettingStartedGuide() {
  const [dismissed, setDismissed] = useState(false);

  // Check if user has dismissed the guide
  useEffect(() => {
    const isDismissed = localStorage.getItem("cloneo_guide_dismissed");
    if (isDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  // Fetch onboarding status
  const { data: onboardingStatus } = useQuery<OnboardingStatus>({
    queryKey: ["onboarding", "status"],
    queryFn: () => api.get<OnboardingStatus>("/api/users/me/onboarding-status"),
  });

  // Fetch content stats
  const { data: contentStats } = useQuery<ContentStats>({
    queryKey: ["stats", "content"],
    queryFn: () => api.get<ContentStats>("/api/stats/content"),
  });

  const hasAvatar = onboardingStatus?.hasAvatar ?? false;
  const hasPersona = onboardingStatus?.hasPersona ?? false;
  const hasContent = (contentStats?.thisWeek ?? 0) > 0;
  const hasApproved = (contentStats?.published ?? 0) + (contentStats?.scheduled ?? 0) > 0;

  const steps: Step[] = [
    {
      id: "persona",
      title: "Set Up Persona",
      description: "Define who you are and what you talk about",
      icon: User,
      completed: hasPersona,
      href: "/dashboard/persona",
      action: "Edit Persona",
    },
    {
      id: "content",
      title: "Generate First Content",
      description: "Let the AI create your first post",
      icon: Sparkles,
      completed: hasContent,
      href: "/dashboard/studio",
      action: "Create Content",
    },
    {
      id: "review",
      title: "Approve Content",
      description: "Review and approve your generated content",
      icon: FileVideo,
      completed: hasApproved,
      href: "/dashboard/studio",
      action: "Go to Studio",
    },
    {
      id: "publish",
      title: "Publish",
      description: "Post your content on social media",
      icon: Share2,
      completed: false, // Will be true when real publishing works
      href: "/dashboard/studio",
      action: "Publish",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = (completedCount / steps.length) * 100;
  const allDone = completedCount === steps.length;

  // Find the current (first incomplete) step
  const currentStep = steps.find((s) => !s.completed) ?? steps[0];

  const handleDismiss = () => {
    localStorage.setItem("cloneo_guide_dismissed", "true");
    setDismissed(true);
  };

  // Don't show if dismissed or all steps complete
  if (dismissed || allDone) {
    return null;
  }

  return (
    <Card className="relative overflow-hidden border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-zinc-900/50 to-zinc-900/50">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 rounded-full p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
            <Rocket className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-white">
              Get Started with CLONEO
            </CardTitle>
            <p className="text-sm text-zinc-400">
              {completedCount} of {steps.length} steps completed
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2 bg-zinc-800" />
        </div>

        {/* Steps list */}
        <div className="space-y-2">
          {steps.map((step, index) => {
            const isCurrentStep = step.id === currentStep?.id;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border p-3 transition-all",
                  step.completed
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : isCurrentStep
                    ? "border-violet-500/40 bg-violet-500/10"
                    : "border-zinc-800 bg-zinc-900/30 opacity-60"
                )}
              >
                {/* Step number / check */}
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                    step.completed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : isCurrentStep
                      ? "bg-violet-500/20 text-violet-400"
                      : "bg-zinc-800 text-zinc-500"
                  )}
                >
                  {step.completed ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.completed
                        ? "text-emerald-400"
                        : isCurrentStep
                        ? "text-white"
                        : "text-zinc-400"
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{step.description}</p>
                </div>

                {/* Action button for current step */}
                {isCurrentStep && !step.completed ? (
                  <Button
                    asChild
                    size="sm"
                    className="shrink-0 gap-1 bg-violet-600 hover:bg-violet-700"
                  >
                    <Link to={step.href}>
                      {step.action}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>

        {/* Quick tip */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
          <p className="text-xs text-zinc-400">
            <span className="font-medium text-zinc-300">Tip:</span>{" "}
            {currentStep?.id === "persona"
              ? "A well-filled persona helps the AI create authentic content in your style."
              : currentStep?.id === "content"
              ? "In the Content Studio you can generate X Posts and videos. Just try it out!"
              : currentStep?.id === "review"
              ? "You always keep control. Nothing gets published without your approval."
              : "Connect your social media accounts to post directly."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
