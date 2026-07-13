import { EllipsisVerticalIcon, SquareDashed } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { Text } from "../ui/text";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import UserSidebarNav from "./UserSidebarNav";

export default function AppSideBar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <div className="inline-flex gap-2 items-center justify-center p-2 select-none">
            <SquareDashed className="text-primary" size={30} />
            <Text
              as="span"
              className="text-primary text-3xl tracking-tighter font-extrabold"
            >
              allmanac
            </Text>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border h-16 justify-center">
        <UserSidebarNav />
      </SidebarFooter>
    </Sidebar>
  );
}
