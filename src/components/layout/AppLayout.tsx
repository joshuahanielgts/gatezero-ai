import { Sidebar } from "./Sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Add top padding on mobile/tablet to account for hamburger menu */}
        <div className="p-4 pt-16 lg:pt-8 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
