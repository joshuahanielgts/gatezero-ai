import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AICommandBar, CommandBarProvider } from "@/components/ai/AICommandBar";
import CommandCenter from "./pages/CommandCenter";
import TheGate from "./pages/TheGate";
import LiveOperations from "./pages/LiveOperations";
import FleetGuard from "./pages/FleetGuard";
import AuditLogs from "./pages/AuditLogs";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Tools from "./pages/Tools";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CommandBarProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AICommandBar />
            <Routes>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/gate" element={<TheGate />} />
              <Route path="/operations" element={<LiveOperations />} />
              <Route path="/fleet" element={<FleetGuard />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CommandBarProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
