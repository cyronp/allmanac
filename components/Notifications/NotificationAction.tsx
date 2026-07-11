import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function NotificationAction() {
  return (
    <>
      <Button variant="ghost" size="icon-lg">
        <BellIcon />
      </Button>
    </>
  );
}
