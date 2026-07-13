import {
  EllipsisVerticalIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu } from "../ui/sidebar";
import { Text } from "../ui/text";

export default function UserSidebarNav() {
  return (
    <SidebarMenu>
      <div className="flex flex-row items-center justify-between w-full gap-2">
        <div className="flex flex-row items-center gap-2 min-w-0">
          <Avatar size="lg" className="shrink-0">
            <AvatarImage src="https://github.com/cyronp.png" />
            <AvatarFallback>am</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0 gap-1">
            <Text
              as="p"
              className="text-sm font-semibold truncate leading-none"
            >
              Cyronp
            </Text>
            <Text
              as="span"
              variant="muted"
              className="text-xs truncate leading-none"
            >
              Current streak: 352
            </Text>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-lg" className="shrink-0">
              <EllipsisVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56">
            <DropdownMenuLabel className="py-2">Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SidebarMenu>
  );
}
