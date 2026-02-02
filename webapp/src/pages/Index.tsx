import Header from "@/components/dashboard/Header";
import HeroSection from "@/components/dashboard/HeroSection";
import WorkflowSection from "@/components/dashboard/WorkflowSection";
import VideoFeaturesSection from "@/components/dashboard/VideoFeaturesSection";
import ValuePropositionSection from "@/components/dashboard/ValuePropositionSection";
import PlatformSection from "@/components/dashboard/PlatformSection";
import PricingSection from "@/components/dashboard/PricingSection";
import RoadmapSection from "@/components/dashboard/RoadmapSection";
import Footer from "@/components/dashboard/Footer";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background">
      {/* Fixed Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-20">
        {/* Hero Section with Autopilot Banner & Review Mode Badge */}
        <HeroSection />

        {/* Review & Approve Workflow */}
        <div id="how-it-works">
          <WorkflowSection />
        </div>

        {/* AI Video Avatar - Core Feature */}
        <div id="features">
          <VideoFeaturesSection />
        </div>

        {/* Value Proposition - Time & Freedom */}
        <ValuePropositionSection />

        {/* Platform Focus - Instagram Reels & TikTok */}
        <PlatformSection />

        {/* Premium Pricing */}
        <PricingSection />

        {/* Coming Soon Roadmap */}
        <div id="roadmap">
          <RoadmapSection />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
