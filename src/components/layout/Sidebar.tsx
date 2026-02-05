import { cn } from "@/lib/utils";
import { NavLink as RouterNavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Shield, 
  Activity, 
  Truck, 
  FileText,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { 
    to: "/", 
    label: "Command Center", 
    icon: LayoutDashboard,
    description: "Dashboard & KPIs"
  },
  { 
    to: "/gate", 
    label: "The Gate", 
    icon: Shield,
    description: "Verification Engine"
  },
  { 
    to: "/operations", 
    label: "Live Operations", 
    icon: Activity,
    description: "Active Trips"
  },
  { 
    to: "/fleet", 
    label: "Fleet Guard", 
    icon: Truck,
    description: "Vehicle & Driver Registry"
  },
  { 
    to: "/audit", 
    label: "Audit Logs", 
    icon: FileText,
    description: "Forensic Trail"
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden bg-card border border-border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo/Brand */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground text-lg tracking-tight">WayGuard AI</h1>
              <p className="text-xs text-muted-foreground">Compliance Firewall</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-dark">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )} 
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isActive && "text-primary"
                    )}>
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-8 bg-primary rounded-full" />
                  )}
                </>
              )}
            </RouterNavLink>
          ))}
        </nav>

        {/* Status Indicator */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-safe/10 border border-safe/20">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-xs text-safe font-medium">System Online</span>
          </div>
        </div>

        {/* Footer/Credits */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
            Powered by <span className="font-medium text-foreground/70">SNR Automations</span>
            <br />
            Architected by <span className="font-medium text-foreground/70">Joshua Haniel J</span>
          </p>
        </div>
      </aside>
    </>
  );
}
