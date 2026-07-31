"use client";

import { useState, type ReactNode } from "react";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { SettingsNavigation } from "./settings-navigation";
import {
  defaultSettingsPageId,
  settingsPages,
  type SettingsPageId,
} from "./settings-page-registry";

interface SettingsDialogProps {
  children: ReactNode;
}

export default function SettingsDialog({ children }: SettingsDialogProps) {
  const [activePageId, setActivePageId] =
    useState<SettingsPageId>(defaultSettingsPageId);

  const activePage =
    settingsPages.find((page) => page.id === activePageId) ?? settingsPages[0];
  const ActivePage = activePage.component;

  return (
    <Dialog>
      {children}
      <DialogContent
        aria-describedby="settings-description"
        className="h-[min(42rem,calc(100dvh-2rem))] max-h-[calc(100dvh-2rem)] gap-0 overflow-hidden border p-0 shadow-2xl sm:max-w-4xl"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription id="settings-description">
            Manage your Allmanac settings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 grid-rows-[auto_1fr] md:grid-cols-[14rem_1fr] md:grid-rows-1">
          <SettingsNavigation
            activePageId={activePageId}
            onPageChange={setActivePageId}
          />

          <main className="relative min-h-0 min-w-0 overflow-y-auto">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10"
                aria-label="Close settings"
              >
                <XIcon />
              </Button>
            </DialogClose>

            <ActivePage />
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}