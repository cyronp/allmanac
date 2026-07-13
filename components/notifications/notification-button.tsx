import * as React from "react";
import { BellIcon } from "lucide-react";
import { Button } from "../ui/button";

interface NotificationButtonProps extends React.ComponentProps<typeof Button> {
  hasNotification?: boolean;
}

const NotificationButton = React.forwardRef<HTMLButtonElement, NotificationButtonProps>(
  ({ hasNotification, ...props }, ref) => {
    return (
      <Button variant="ghost" size="icon-lg" ref={ref} {...props}>
        <BellIcon />
        {hasNotification && (
          <div className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full" />
        )}
      </Button>
    );
  }
);
NotificationButton.displayName = "NotificationButton";

export default NotificationButton;
