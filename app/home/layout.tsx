import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSideBar from "@/components/Sidebar/AppSideBar";
import AppHeader from "@/components/Header/AppHeader";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="p-2">
      <AppSideBar />
      <SidebarTrigger size="icon-lg" />
      <AppHeader />
      {children}
    </SidebarProvider>
  );
}
