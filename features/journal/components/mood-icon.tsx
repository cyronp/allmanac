import type { ComponentProps, ComponentType } from "react";

import type { Mood } from "../journal.types";
import Bad from "./mood-icons/bad";
import Happy from "./mood-icons/happy";
import Meh from "./mood-icons/meh";
import Stressed from "./mood-icons/stressed";
import VeryHappy from "./mood-icons/very-happy";

const MOOD_ICONS = {
  stressed: Stressed,
  bad: Bad,
  meh: Meh,
  good: Happy,
  happy: VeryHappy,
} satisfies Record<Mood, ComponentType<ComponentProps<"svg">>>;

interface MoodIconProps extends ComponentProps<"svg"> {
  mood: Mood;
}

export function MoodIcon({ mood, ...props }: MoodIconProps) {
  const Icon = MOOD_ICONS[mood];
  const hasAccessibleName = Boolean(
    props["aria-label"] || props["aria-labelledby"],
  );

  return (
    <Icon
      {...props}
      aria-hidden={hasAccessibleName ? undefined : true}
      focusable="false"
      role={hasAccessibleName ? "img" : undefined}
    />
  );
}
