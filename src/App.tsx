import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CommandCenter from "./pages/CommandCenter";
import TheGate from "./pages/TheGate";
import LiveOperations from "./pages/LiveOperations";
import FleetGuard from "./pages/FleetGuard";
import AuditLogs from "./pages/AuditLogs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CommandCenter />} />
          <Route path="/gate" element={<TheGate />} />
          <Route path="/operations" element={<LiveOperations />} />
          <Route path="/fleet" element={<FleetGuard />} />
          <Route path="/audit" element={<AuditLogs />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
