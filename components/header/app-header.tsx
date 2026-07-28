import NotificationMenu from "../notifications/notification-menu";
import NotificationButton from "../notifications/notification-button";
import { DynamicBreadcrumb } from "../ui/dynamic-breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 w-full shrink-0 items-center px-4">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="md:hidden" />
          <DynamicBreadcrumb />
        </div>

        <NotificationMenu
          NotificationsTrigger={<NotificationButton hasNotification />}
        />
      </div>
    </header>
  );
}
