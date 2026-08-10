"use client";

import {
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { formatSleepDuration, getSleepHours } from "../journal.utils";

const MINUTES_PER_DAY = 24 * 60;
const MINUTE_STEP = 5;
const CLOCK_DIAMETER = 224;
const CLOCK_CENTER = 112;
const CLOCK_RADIUS = 100;
const CLOCK_CIRCUMFERENCE = 2 * Math.PI * CLOCK_RADIUS;
const FACE_TICK_RADIUS = 80;
const FACE_NUMBER_RADIUS = 76;

type TimeKind = "bedtime" | "wakeTime";

interface SleepClockSelectorProps {
  bedtime: string;
  wakeTime: string;
  onTimeChange: (kind: TimeKind, value: string) => void;
  className?: string;
}

function parseTime(value: string, fallback: number) {
  const [hours, minutes] = value.split(":").map(Number);

  if (
    !Number.isInteger(hours) ||
    !Number.isInteger(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return fallback;
  }

  return hours * 60 + minutes;
}

function formatTime(minutes: number) {
  const normalized =
    ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(normalized / 60);
  const remainder = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function getHandleStyle(minutes: number): CSSProperties {
  const angle = (minutes / MINUTES_PER_DAY) * Math.PI * 2;
  const x = (Math.sin(angle) * CLOCK_RADIUS * 100) / CLOCK_DIAMETER;
  const y = (-Math.cos(angle) * CLOCK_RADIUS * 100) / CLOCK_DIAMETER;

  return {
    left: `calc(50% + ${x}%)`,
    top: `calc(50% + ${y}%)`,
  };
}

function getFacePositionStyle(index: number, radius: number): CSSProperties {
  const angle = (index / 12) * Math.PI * 2;
  const x = (Math.sin(angle) * radius * 100) / CLOCK_DIAMETER;
  const y = (-Math.cos(angle) * radius * 100) / CLOCK_DIAMETER;

  return {
    left: `calc(50% + ${x}%)`,
    top: `calc(50% + ${y}%)`,
  };
}

export function SleepClockSelector({
  bedtime,
  wakeTime,
  onTimeChange,
  className,
}: SleepClockSelectorProps) {
  const clockRef = useRef<HTMLDivElement>(null);
  const bedtimeMinutes = parseTime(bedtime, 0);
  const wakeTimeMinutes = parseTime(wakeTime, 4 * 60 + 40);
  const sleepHours = getSleepHours({ bedtime, wakeTime });
  const hasSelectedTime = Boolean(bedtime || wakeTime);
  const totalSleep = formatSleepDuration(sleepHours);
  const totalSleepLabel =
    totalSleep === "—" ? "00:00" : totalSleep.padStart(5, "0");
  const previewArcMinutes =
    (wakeTimeMinutes - bedtimeMinutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const sleepArcMinutes =
    sleepHours === null
      ? hasSelectedTime
        ? previewArcMinutes
        : 0
      : Math.round(sleepHours * 60);
  const sleepArcLength =
    (sleepArcMinutes / MINUTES_PER_DAY) * CLOCK_CIRCUMFERENCE;
  const sleepArcRotation =
    (bedtimeMinutes / MINUTES_PER_DAY) * 360 - 90;

  function updateFromPointer(
    kind: TimeKind,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    const clock = clockRef.current;
    if (!clock) return;

    const bounds = clock.getBoundingClientRect();
    const x = event.clientX - (bounds.left + bounds.width / 2);
    const y = event.clientY - (bounds.top + bounds.height / 2);
    const angle = (Math.atan2(x, -y) + Math.PI * 2) % (Math.PI * 2);
    const rawMinutes = (angle / (Math.PI * 2)) * MINUTES_PER_DAY;
    const minutes =
      (Math.round(rawMinutes / MINUTE_STEP) * MINUTE_STEP) % MINUTES_PER_DAY;

    onTimeChange(kind, formatTime(minutes));
  }

  function handlePointerDown(
    kind: TimeKind,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    event.preventDefault();
    event.currentTarget.focus();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(kind, event);
  }

  function handlePointerMove(
    kind: TimeKind,
    event: PointerEvent<HTMLButtonElement>,
  ) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateFromPointer(kind, event);
  }

  function handleKeyDown(
    kind: TimeKind,
    currentMinutes: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    const increments: Partial<Record<string, number>> = {
      ArrowDown: -MINUTE_STEP,
      ArrowLeft: -MINUTE_STEP,
      ArrowRight: MINUTE_STEP,
      ArrowUp: MINUTE_STEP,
      PageDown: -60,
      PageUp: 60,
    };

    if (event.key === "Home") {
      event.preventDefault();
      onTimeChange(kind, "00:00");
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      onTimeChange(kind, "23:55");
      return;
    }

    const increment = increments[event.key];
    if (increment === undefined) return;

    event.preventDefault();
    onTimeChange(kind, formatTime(currentMinutes + increment));
  }

  const handles = [
    {
      kind: "bedtime" as const,
      label: "Sleep time",
      value: bedtime || "00:00",
      minutes: bedtimeMinutes,
      icon: MoonIcon,
      iconClassName: "text-purple-800 dark:text-purple-400",
    },
    {
      kind: "wakeTime" as const,
      label: "Awake time",
      value: wakeTime || "00:00",
      minutes: wakeTimeMinutes,
      icon: SunIcon,
      iconClassName: "text-amber-500 dark:text-amber-400",
    },
  ];

  return (
    <div
      ref={clockRef}
      className={cn(
        "relative isolate flex size-[min(18rem,calc(100vw-4rem))] shrink-0 items-center justify-center rounded-full bg-gray-300 select-none shadow-[inset_0_0_12px_rgba(0,0,0,0.3)] sm:size-80 dark:bg-gray-700",
        className,
      )}
      role="group"
      aria-label="Sleep schedule clock selector"
    >
      {(sleepHours !== null || sleepArcMinutes > 0) && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full text-primary"
          viewBox="0 0 224 224"
        >
          <circle
            cx={CLOCK_CENTER}
            cy={CLOCK_CENTER}
            r={CLOCK_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${sleepArcLength} ${CLOCK_CIRCUMFERENCE - sleepArcLength}`,
              transform: `rotate(${sleepArcRotation}deg)`,
              transformOrigin: "center",
            }}
          />
        </svg>
      )}

      <div className="relative flex size-[78.571%] flex-col items-center justify-center gap-1 rounded-full bg-background p-3 shadow-[0_0_6px_rgba(0,0,0,0.25)]">
        <div aria-hidden="true" className="absolute inset-0 rounded-full">
          {Array.from({ length: 12 }, (_, index) => index)
            .filter((index) => index % 3 !== 0)
            .map((index) => (
              <span
                key={index}
                className="absolute h-1.5 w-0.5 bg-muted-foreground/35"
                style={{
                  ...getFacePositionStyle(index, FACE_TICK_RADIUS),
                  transform: `translate(-50%, -50%) rotate(${index * 30}deg)`,
                }}
              />
            ))}

          {["12", "3", "6", "9"].map((label, index) => (
            <span
              key={label}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-base leading-none font-bold text-muted-foreground tabular-nums sm:text-lg"
              style={getFacePositionStyle(index * 3, FACE_NUMBER_RADIUS)}
            >
              {label}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          <p className="text-[15px] leading-[normal] font-semibold whitespace-nowrap sm:text-base">
            Total sleep: {totalSleepLabel}
          </p>
          <p className="text-[13px] leading-[normal] font-medium text-muted-foreground whitespace-nowrap sm:text-sm">
            Sleep hour: {bedtime || "00:00"}
          </p>
          <p className="text-[13px] leading-[normal] font-medium text-muted-foreground whitespace-nowrap sm:text-sm">
            Awake hour: {wakeTime || "00:00"}
          </p>
        </div>
      </div>

      {handles.map((handle) => {
        const Icon = handle.icon;

        return (
          <button
            key={handle.kind}
            type="button"
            role="slider"
            className={cn(
              "absolute z-10 flex size-12 -translate-x-1/2 -translate-y-1/2 touch-none cursor-grab items-center justify-center rounded-full bg-background shadow-[inset_0_0_0_2px_rgba(0,0,0,0.12),inset_0_-4px_8px_rgba(0,0,0,0.2)] outline-none transition-[scale,box-shadow] active:cursor-grabbing active:scale-110 active:shadow-[inset_0_0_0_2px_rgba(0,0,0,0.16),inset_0_-5px_10px_rgba(0,0,0,0.25)] active:ring-4 active:ring-primary/20 focus-visible:ring-3 focus-visible:ring-ring/50",
              handle.iconClassName,
            )}
            style={getHandleStyle(handle.minutes)}
            aria-label={`${handle.label}: ${handle.value}`}
            aria-valuemin={0}
            aria-valuemax={MINUTES_PER_DAY - MINUTE_STEP}
            aria-valuenow={parseTime(handle.value, 0)}
            aria-valuetext={handle.value}
            onKeyDown={(event) =>
              handleKeyDown(handle.kind, handle.minutes, event)
            }
            onPointerDown={(event) => handlePointerDown(handle.kind, event)}
            onPointerMove={(event) => handlePointerMove(handle.kind, event)}
          >
            <Icon className="size-6" aria-hidden="true" />
          </button>
        );
      })}

      <p className="sr-only">
        Drag either handle around the clock, or focus a handle and use the arrow
        keys to adjust it by five minutes. Page Up and Page Down adjust by one
        hour.
      </p>
    </div>
  );
}
