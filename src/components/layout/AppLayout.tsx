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
        {/* Responsive padding: mobile=16px, tablet=24px, desktop=32px */}
        <div className="p-4 md:p-6 lg:p-8 pt-16 md:pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
