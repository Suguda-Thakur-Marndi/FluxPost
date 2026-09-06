import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/app/routes/dashboard/_common/app-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col min-w-0 bg-background border-l border-border/70 overflow-hidden h-screen">
          <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

