import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/onboarding/Onboarding";
import AvatarCreation from "./pages/onboarding/AvatarCreation";
import PersonaSetup from "./pages/onboarding/PersonaSetup";
import PlatformsConnect from "./pages/onboarding/PlatformsConnect";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import ContentStudio from "./pages/dashboard/ContentStudio";
import AvatarManagement from "./pages/dashboard/AvatarManagement";
import PersonaManagement from "./pages/dashboard/PersonaManagement";
import ContentCalendar from "./pages/dashboard/ContentCalendar";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* Onboarding Flow */}
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/avatar" element={<AvatarCreation />} />
          <Route path="/onboarding/persona" element={<PersonaSetup />} />
          <Route path="/onboarding/platforms" element={<PlatformsConnect />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="studio" element={<ContentStudio />} />
            <Route path="avatar" element={<AvatarManagement />} />
            <Route path="persona" element={<PersonaManagement />} />
            <Route path="calendar" element={<ContentCalendar />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
