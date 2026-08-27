import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/routes/dashboard/_common/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background dark:mesh-bg-dark mesh-bg selection:bg-primary/30">
        <AppSidebar />
        <SidebarInset className="bg-transparent border-none flex-1 flex flex-col h-screen overflow-hidden">
          <div className="m-2 md:m-3 lg:m-4 flex-1 rounded-[1.5rem] border border-white/20 dark:border-white/10 shadow-2xl glass-card overflow-hidden relative flex flex-col">
            <div className="h-full bg-background/60 dark:bg-background/40 backdrop-blur-3xl flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
