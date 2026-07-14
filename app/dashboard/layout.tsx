import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 px-3 w-full">
          <SidebarTrigger size="icon-lg" />
          <AppHeader />
        </header>
        <main className="flex flex-1 flex-col px-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
