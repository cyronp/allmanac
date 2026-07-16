import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/header/app-header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-sidebar">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 px-4 w-full">
          <AppHeader />
        </header>
        <main className="flex flex-1 flex-col px-4 pb-4">
          <div className="flex-1 rounded-xl border border-sidebar-border bg-background p-6 shadow-xs">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
