import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AppSidebar from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/header/app-header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="h-svh min-h-0 overflow-hidden">
      <AppSidebar />
      <SidebarInset className="min-h-0 min-w-0 overflow-hidden bg-sidebar">
        <AppHeader />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pr-4 pb-4">
          <ScrollArea
            type="always"
            className="min-h-0 min-w-0 flex-1 rounded-xl border border-sidebar-border bg-background shadow-xs"
          >
            <div className="p-6">{children}</div>
          </ScrollArea>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
