import NotificationMenu from "../notifications/notification-menu";
import NotificationButton from "../notifications/notification-button";
import { DynamicBreadcrumb } from "../ui/dynamic-breadcrumb";

export default function AppHeader() {
  return (
    <div className="flex flex-1 items-center justify-between">
      <DynamicBreadcrumb />

      <NotificationMenu
        NotificationsTrigger={<NotificationButton hasNotification />}
      />
    </div>
  );
}
