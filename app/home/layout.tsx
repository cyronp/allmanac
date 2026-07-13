import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import AppHeader from "@/components/header/app-header";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="p-2">
      <AppSidebar />
      <SidebarTrigger size="icon-lg" />
      <AppHeader />
      {children}
    </SidebarProvider>
  );
}
