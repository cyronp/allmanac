"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const GOAL_COLORS = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#EAB308",
  "#84CC16",
  "#22C55E",
  "#10B981",
  "#14B8A6",
  "#06B6D4",
  "#0EA5E9",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#A855F7",
  "#D946EF",
  "#EC4899",
  "#F43F5E",
  "#78716C",
] as const;

const HEX_COLOR_PATTERN = /^#[0-9A-F]{6}$/i;

function hexToHsl(color: string) {
  const red = Number.parseInt(color.slice(1, 3), 16) / 255;
  const green = Number.parseInt(color.slice(3, 5), 16) / 255;
  const blue = Number.parseInt(color.slice(5, 7), 16) / 255;
  const maximum = Math.max(red, green, blue);
  const minimum = Math.min(red, green, blue);
  const delta = maximum - minimum;
  const lightness = (maximum + minimum) / 2;

  if (delta === 0) return { hue: 0, saturation: 0, lightness };

  const saturation = delta / (1 - Math.abs(2 * lightness - 1));
  const hueSector =
    maximum === red
      ? ((green - blue) / delta) % 6
      : maximum === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return {
    hue: Math.round((hueSector * 60 + 360) % 360),
    saturation,
    lightness,
  };
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const secondary = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const offset = lightness - chroma / 2;
  const [red, green, blue] =
    hue < 60
      ? [chroma, secondary, 0]
      : hue < 120
        ? [secondary, chroma, 0]
        : hue < 180
          ? [0, chroma, secondary]
          : hue < 240
            ? [0, secondary, chroma]
            : hue < 300
              ? [secondary, 0, chroma]
              : [chroma, 0, secondary];

  return `#${[red, green, blue]
    .map((channel) =>
      Math.round((channel + offset) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`.toUpperCase();
}

interface GoalColorPickerProps {
  id: string;
  value: string;
  describedBy?: string;
  onChange: (color: string) => void;
}

export function GoalColorPicker({
  id,
  value,
  describedBy,
  onChange,
}: GoalColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [hexValue, setHexValue] = useState(value.toUpperCase());

  function updateOpen(nextOpen: boolean) {
    if (nextOpen) setHexValue(value.toUpperCase());
    setOpen(nextOpen);
  }

  function selectColor(color: string) {
    onChange(color);
    setOpen(false);
  }

  function updateHexValue(nextValue: string) {
    const withHash = nextValue.startsWith("#") ? nextValue : `#${nextValue}`;
    const formatted = withHash.slice(0, 7).toUpperCase();
    setHexValue(formatted);
    if (HEX_COLOR_PATTERN.test(formatted)) onChange(formatted);
  }

  function restoreValidColor() {
    if (!HEX_COLOR_PATTERN.test(hexValue)) setHexValue(value.toUpperCase());
  }

  function updateHue(hue: number) {
    const currentColor = hexToHsl(value);
    const isNeutral = currentColor.saturation < 0.08;
    const color = hslToHex(
      hue,
      isNeutral ? 0.75 : currentColor.saturation,
      isNeutral ? 0.55 : currentColor.lightness,
    );

    setHexValue(color);
    onChange(color);
  }

  const hue = hexToHsl(value).hue;

  return (
    <Popover modal open={open} onOpenChange={updateOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-expanded={open}
          aria-describedby={describedBy}
          className="w-full justify-between px-2.5 font-normal"
        >
          <span className="flex min-w-0 items-center gap-2">
            <span
              className="size-4 shrink-0 rounded-sm ring-1 ring-foreground/15"
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase">{value}</span>
          </span>
          <ChevronDownIcon className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-64 gap-3 p-3">
        <div>
          <p className="font-medium">Choose a color</p>
          <p className="text-xs text-muted-foreground">
            Select a swatch or enter a hex value.
          </p>
        </div>
        <div
          className="grid grid-cols-6 gap-2"
          role="group"
          aria-label="Goal colors"
        >
          {GOAL_COLORS.map((color) => {
            const selected = color.toUpperCase() === value.toUpperCase();
            return (
              <button
                key={color}
                type="button"
                aria-label={`Use color ${color}`}
                aria-pressed={selected}
                onClick={() => selectColor(color)}
                className={cn(
                  "flex size-8 items-center justify-center rounded-md ring-1 ring-foreground/10 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  selected &&
                    "ring-2 ring-foreground ring-offset-2 ring-offset-popover",
                )}
                style={{ backgroundColor: color }}
              >
                {selected && (
                  <CheckIcon
                    className="size-4 text-white drop-shadow-sm"
                    strokeWidth={3}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
        <div className="grid gap-1.5 border-t pt-3">
          <label htmlFor={`${id}-hex`} className="text-xs font-medium">
            Custom hex
          </label>
          <div className="flex items-center gap-2">
            <span
              className="size-8 shrink-0 rounded-lg ring-1 ring-foreground/15"
              style={{ backgroundColor: value }}
              aria-hidden="true"
            />
            <Input
              id={`${id}-hex`}
              value={hexValue}
              onChange={(event) => updateHexValue(event.target.value)}
              onBlur={restoreValidColor}
              aria-invalid={!HEX_COLOR_PATTERN.test(hexValue)}
              className="font-mono uppercase"
              placeholder="#84CC16"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="mt-1 grid gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor={`${id}-hue`} className="font-medium">
                Hue
              </label>
              <span className="font-mono text-muted-foreground">
                {hue}°
              </span>
            </div>
            <input
              id={`${id}-hue`}
              type="range"
              min="0"
              max="359"
              value={hue}
              onChange={(event) => updateHue(Number(event.target.value))}
              aria-valuetext={`${hue} degrees`}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[linear-gradient(to_right,#ef4444,#eab308,#22c55e,#06b6d4,#3b82f6,#a855f7,#ef4444)] outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-transparent [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:ring-1 [&::-moz-range-thumb]:ring-foreground/40 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-transparent [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:ring-1 [&::-webkit-slider-thumb]:ring-foreground/40"
            />
          </div>
          {!HEX_COLOR_PATTERN.test(hexValue) && (
            <p className="text-xs text-destructive" role="alert">
              Enter a 6-digit hex color.
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
