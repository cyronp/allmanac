import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";
import NotificationAction from "../notifications/notification-action";

export default function AppHeader() {
  return (
    <header className="absolute flex flex-row gap-4 right-4">
      <NotificationAction/>
    </header>
  );
}
