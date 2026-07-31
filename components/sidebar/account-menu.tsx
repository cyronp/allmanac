"use client";

import {
  EllipsisVerticalIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DialogTrigger } from "../ui/dialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { Text } from "../ui/text";
import SettingsDialog from "../settings/settings-dialog";

export default function AccountMenu() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SettingsDialog>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                {isCollapsed ? (
                  <Avatar className="rounded-md">
                    <AvatarImage
                      src="https://github.com/cyronp.png"
                      className="rounded-md"
                    />
                    <AvatarFallback className="rounded-md">am</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar size="default" className="shrink-0">
                    <AvatarImage src="https://github.com/cyronp.png" />
                    <AvatarFallback>am</AvatarFallback>
                  </Avatar>
                )}
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 gap-0.5">
                    <Text
                      as="p"
                      className="text-sm font-semibold truncate leading-none"
                    >
                      Cyronp
                    </Text>
                    <Text
                      as="span"
                      className="text-xs truncate leading-none text-muted-foreground"
                    >
                      Current streak: 352
                    </Text>
                  </div>
                )}
                {!isCollapsed && (
                  <EllipsisVerticalIcon className="ml-auto shrink-0" />
                )}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" side="right" align="end">
              <DropdownMenuLabel className="py-2">Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <UserIcon />
                  Profile
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    Settings
                  </DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOutIcon />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SettingsDialog>
  );
}
