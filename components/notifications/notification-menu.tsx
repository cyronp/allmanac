"use client";

import { ReactNode, useState } from "react";
import {
  BellOffIcon,
  FileTextIcon,
  TargetIcon,
  SettingsIcon,
  CheckCheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import NotificationCard from "./notification-card";

interface NotificationMenuProps {
  NotificationsTrigger: ReactNode;
}

export default function NotificationMenu({
  NotificationsTrigger,
}: NotificationMenuProps) {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Contract review pending",
      description:
        "Review and sign the assistant manager contract for John Smith.",
      time: "10m ago",
      isUnread: true,
      icon: FileTextIcon,
      isAnimatingOut: false,
    },
    {
      id: "2",
      title: "Weekly goal updated",
      description: "Your team weekly goal has been set to 35 projects.",
      time: "2h ago",
      isUnread: true,
      icon: TargetIcon,
      isAnimatingOut: false,
    },
    {
      id: "3",
      title: "System maintenance",
      description:
        "Allmanac will be offline for 30 minutes tonight at 12:00 AM UTC.",
      time: "1d ago",
      isUnread: false,
      icon: SettingsIcon,
      isAnimatingOut: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.isUnread && !n.isAnimatingOut).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isAnimatingOut: true } : n)),
    );
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, isUnread: false, isAnimatingOut: false } : n
        )
      );
    }, 300);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.isUnread ? { ...n, isAnimatingOut: true } : n))
    );
    setTimeout(() => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.isUnread ? { ...n, isUnread: false, isAnimatingOut: false } : n
        )
      );
    }, 300);
  };

  const visibleNotifications = notifications.filter(
    (n) => n.isUnread || n.isAnimatingOut
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{NotificationsTrigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-96 p-0 overflow-hidden rounded-xl border border-border bg-popover shadow-md"
        align="end"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Text as="span" className="text-lg font-semibold text-foreground">
              Notifications
            </Text>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="default"
              onClick={handleMarkAllAsRead}
              className="text-sm text-primary hover:text-primary/80 hover:bg-transparent font-medium"
            >
              <CheckCheckIcon/> Mark all as read
            </Button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                title={n.title}
                description={n.description}
                time={n.time}
                isUnread={n.isUnread}
                icon={n.icon}
                isAnimatingOut={n.isAnimatingOut}
                onMarkAsRead={() => handleMarkAsRead(n.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-muted-foreground">
                <BellOffIcon size={32} />
              </div>
              <Text as="p" className="text-sm font-medium text-foreground">
                Great Job!
              </Text>
              <Text as="span" variant="muted" className="text-xs mt-1">
                You have no new notifications at the moment.
              </Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full h-8 text-xs font-semibold hover:bg-accent hover:text-accent-foreground justify-center"
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
