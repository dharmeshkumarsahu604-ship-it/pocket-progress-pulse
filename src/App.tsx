import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Rocks from "./pages/Rocks";
import RockDetail from "./pages/RockDetail";
import Minerals from "./pages/Minerals";
import MineralDetail from "./pages/MineralDetail";
import Scanner from "./pages/Scanner";
import More from "./pages/More";
import VoiceNotes from "./pages/VoiceNotes";
import FieldNotes from "./pages/FieldNotes";
import Sites from "./pages/Sites";
import SiteDetail from "./pages/SiteDetail";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
            <Route path="/chat" element={<Chat />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
