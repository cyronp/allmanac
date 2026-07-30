import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import { Settings2Icon, Bell } from "lucide-react";

import { GeneralSettingsPage } from "./pages/general-settings-page";

interface SettingsPageDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  component: ComponentType;
}

export const settingsPages = [
  {
    id: "general",
    label: "General",
    icon: Settings2Icon,
    component: GeneralSettingsPage,
  },
  {
    id: "notification",
    label: "Notifications",
    icon: Bell,
    component: GeneralSettingsPage,
  },
] as const satisfies readonly SettingsPageDefinition[];

export type SettingsPageId = (typeof settingsPages)[number]["id"];

export const defaultSettingsPageId: SettingsPageId = settingsPages[0].id;
