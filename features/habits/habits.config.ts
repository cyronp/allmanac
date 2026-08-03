import {
  BookOpenIcon,
  BriefcaseBusinessIcon,
  DumbbellIcon,
  GraduationCapIcon,
  HashIcon,
  MoonStarIcon,
  type LucideIcon,
} from "lucide-react";

import type { HabitCategory } from "./habits.types";

interface CategoryStyle {
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

export const DAYS_OF_WEEK = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const CATEGORY_STYLES: Record<HabitCategory, CategoryStyle> = {
  work: {
    label: "Work",
    icon: BriefcaseBusinessIcon,
    iconClassName: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  sleep: {
    label: "Sleep",
    icon: MoonStarIcon,
    iconClassName: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  school: {
    label: "School",
    icon: GraduationCapIcon,
    iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  fitness: {
    label: "Fitness",
    icon: DumbbellIcon,
    iconClassName: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  reading: {
    label: "Reading",
    icon: BookOpenIcon,
    iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  others: {
    label: "Others",
    icon: HashIcon,
    iconClassName: "bg-lime-500/10 text-lime-700 dark:text-lime-400",
  },
};
