"use client";

import { cn } from "@/lib/utils";

import { settingsPages, type SettingsPageId } from "./settings-page-registry";
import { Button } from "../ui/button";

interface SettingsNavigationProps {
  activePageId: SettingsPageId;
  onPageChange: (pageId: SettingsPageId) => void;
}

export function SettingsNavigation({
  activePageId,
  onPageChange,
}: SettingsNavigationProps) {
  return (
    <aside className="flex min-w-0 flex-col border-b bg-sidebar md:border-r md:border-b-0">
      <div className="hidden h-16 shrink-0 items-center px-5 md:flex">
        <p className="text-base font-semibold tracking-tight">Settings</p>
      </div>

      <nav
        aria-label="Settings pages"
        className="scrollbar-none flex gap-1 overflow-x-auto p-2 md:flex-1 md:flex-col md:overflow-visible md:px-3 md:py-1"
      >
        {settingsPages.map((page) => {
          const Icon = page.icon;
          const isActive = activePageId === page.id;

          return (
            <Button
              key={page.id}
              type="button"
              variant="ghost"
              aria-current={isActive ? "page" : undefined}
              onClick={() => onPageChange(page.id)}
              className={cn(
                "flex h-9 shrink-0 items-center justify-start gap-2.5 rounded-lg px-3 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 md:w-full",
                isActive
                  ? "bg-muted"
                  : "text-muted-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {page.label}
            </Button>
          );
        })}
      </nav>
    </aside>
  );
}
