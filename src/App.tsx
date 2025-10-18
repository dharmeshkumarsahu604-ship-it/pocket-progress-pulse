import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
