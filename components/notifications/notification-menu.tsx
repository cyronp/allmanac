"use client";

import { ReactNode, useState } from "react";
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
      isAnimatingOut: false,
    },
    {
      id: "2",
      title: "Weekly goal updated",
      description: "Your team weekly goal has been set to 35 projects.",
      time: "2h ago",
      isUnread: true,
      isAnimatingOut: false,
    },
    {
      id: "3",
      title: "System maintenance",
      description:
        "Allmanac will be offline for 30 minutes tonight at 12:00 AM UTC.",
      time: "1d ago",
      isUnread: false,
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
        className="flex w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border border-border bg-popover p-0 shadow-md sm:w-96"
        align="end"
        collisionPadding={16}
      >
        {/* Header */}
        <div className="flex shrink-0 flex-col items-start gap-2 border-b border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <Text as="span" className="text-lg font-semibold text-foreground">
            Notifications
          </Text>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto px-0 py-1 text-sm font-medium text-primary hover:bg-transparent hover:text-primary/80 sm:px-2"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Scrollable List */}
        <div className="min-h-0 max-h-96 flex-1 space-y-1.5 overflow-y-auto p-1.5 scrollbar-thin sm:p-2">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((n) => (
              <NotificationCard
                key={n.id}
                title={n.title}
                description={n.description}
                time={n.time}
                isUnread={n.isUnread}
                isAnimatingOut={n.isAnimatingOut}
                onMarkAsRead={() => handleMarkAsRead(n.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center select-none">
              <Text as="p" className="text-sm font-medium text-foreground">
                Great Job!
              </Text>
              <Text as="span" className="text-xs mt-1 text-muted-foreground">
                You have no new notifications at the moment.
              </Text>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-2">
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
