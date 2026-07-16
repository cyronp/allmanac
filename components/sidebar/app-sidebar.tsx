"use client";

import {
  CalendarIcon,
  LayoutGrid,
  SquareDashed,
  TrophyIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "../ui/sidebar";
import UserSidebarNav from "./user-sidebar-nav";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

const navItems = [
  { title: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { title: "Calendar", icon: CalendarIcon, href: "/dashboard/calendar" },
  { title: "Your Goals", icon: TrophyIcon, href: "/dashboard/goals" },
];

const recentItems = [
  { title: "Example 1", href: "#" },
  { title: "Example 2", href: "#" },
  { title: "Example 3", href: "#" },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center">
        <div className="flex items-center justify-between w-full">
          {!isCollapsed && (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <SquareDashed size={18} />
            </div>
          )}
          <SidebarTrigger size="icon-lg" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={cn(
                        "h-10",
                        isActive &&
                          "bg-primary! text-primary-foreground! hover:bg-primary/90! hover:text-primary-foreground! active:bg-primary/80! active:text-primary-foreground!",
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Recents</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {recentItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.href}>
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="h-16 justify-center">
        <UserSidebarNav />
      </SidebarFooter>
    </Sidebar>
  );
}
