import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Suspense, lazy } from "react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { useDarkMode } from "@/hooks/useDarkMode";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Rocks = lazy(() => import("./pages/Rocks"));
const RockDetail = lazy(() => import("./pages/RockDetail"));
const Minerals = lazy(() => import("./pages/Minerals"));
const MineralDetail = lazy(() => import("./pages/MineralDetail"));
const Scanner = lazy(() => import("./pages/Scanner"));
const More = lazy(() => import("./pages/More"));
const VoiceNotes = lazy(() => import("./pages/VoiceNotes"));
const FieldNotes = lazy(() => import("./pages/FieldNotes"));
const Sites = lazy(() => import("./pages/Sites"));
const SiteDetail = lazy(() => import("./pages/SiteDetail"));
const FieldTrips = lazy(() => import("./pages/FieldTrips"));
const FieldTripView = lazy(() => import("./pages/FieldTripView"));
const Chat = lazy(() => import("./pages/Chat"));
const Auth = lazy(() => import("./pages/Auth"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const Compass = lazy(() => import("./pages/Compass"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen p-4 bg-background">
    <LoadingSkeleton />
  </div>
);

const AppContent = () => {
  useDarkMode(); // Initialize dark mode
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rocks" element={<Rocks />} />
        <Route path="/rocks/:id" element={<RockDetail />} />
        <Route path="/minerals" element={<Minerals />} />
        <Route path="/minerals/:id" element={<MineralDetail />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/more" element={<More />} />
        <Route path="/voice-notes" element={<VoiceNotes />} />
        <Route path="/field-notes" element={<FieldNotes />} />
            <Route path="/sites" element={<Sites />} />
            <Route path="/sites/:id" element={<SiteDetail />} />
            <Route path="/field-trips" element={<FieldTrips />} />
            <Route path="/field-trips/:id" element={<FieldTripView />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
