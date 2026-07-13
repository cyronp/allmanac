import NotificationMenu from "../notifications/notification-menu";
import NotificationButton from "../notifications/notification-button";

export default function AppHeader() {
  return (
    <header className="absolute flex flex-row gap-4 right-4">
      <NotificationMenu
        NotificationsTrigger={<NotificationButton hasNotification />}
      />
    </header>
  );
}
