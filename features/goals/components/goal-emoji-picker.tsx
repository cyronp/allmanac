"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { SmilePlusIcon } from "lucide-react";
import type { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-88 w-80 max-w-[calc(100vw-2rem)] items-center justify-center text-sm text-muted-foreground"
      role="status"
    >
      Loading emoji picker…
    </div>
  ),
});

const pickerStyle = {
  "--epr-highlight-color": "var(--primary)",
  "--epr-dark-highlight-color": "var(--primary)",
  "--epr-hover-bg-color": "var(--accent)",
  "--epr-dark-hover-bg-color": "var(--accent)",
  "--epr-focus-bg-color": "var(--accent)",
  "--epr-dark-focus-bg-color": "var(--accent)",
  "--epr-text-color": "var(--muted-foreground)",
  "--epr-dark-text-color": "var(--muted-foreground)",
  "--epr-picker-border-color": "transparent",
  "--epr-dark-picker-border-color": "transparent",
  "--epr-picker-border-radius": "0",
  "--epr-bg-color": "var(--popover)",
  "--epr-dark-bg-color": "var(--popover)",
  "--epr-horizontal-padding": "8px",
  "--epr-header-padding": "8px 8px 6px",
  "--epr-search-input-bg-color": "var(--muted)",
  "--epr-dark-search-input-bg-color": "var(--muted)",
  "--epr-search-input-bg-color-active": "var(--muted)",
  "--epr-dark-search-input-bg-color-active": "var(--muted)",
  "--epr-search-border-color": "transparent",
  "--epr-search-border-color-active": "var(--ring)",
  "--epr-search-input-border-radius": "6px",
  "--epr-search-input-height": "32px",
  "--epr-category-navigation-button-size": "26px",
  "--epr-category-padding": "0 8px",
  "--epr-category-label-bg-color":
    "color-mix(in oklch, var(--popover) 94%, transparent)",
  "--epr-dark-category-label-bg-color":
    "color-mix(in oklch, var(--popover) 94%, transparent)",
  "--epr-category-label-text-color": "var(--muted-foreground)",
  "--epr-category-label-height": "28px",
  "--epr-category-label-padding": "0 10px",
  "--epr-category-icon-active-color": "var(--primary)",
  "--epr-dark-category-icon-active-color": "var(--primary)",
  "--epr-emoji-size": "26px",
  "--epr-emoji-padding": "4px",
  "--epr-emoji-hover-color": "var(--accent)",
  "--epr-emoji-variation-picker-bg-color": "var(--popover)",
  "--epr-dark-emoji-variation-picker-bg-color": "var(--popover)",
  "--epr-emoji-variation-indicator-color": "var(--border)",
  "--epr-dark-emoji-variation-indicator-color": "var(--border)",
} as CSSProperties;

interface GoalEmojiPickerProps {
  id: string;
  value: string;
  describedBy?: string;
  onChange: (emoji: string) => void;
}

export function GoalEmojiPicker({
  id,
  value,
  describedBy,
  onChange,
}: GoalEmojiPickerProps) {
  const [open, setOpen] = useState(false);

  function selectEmoji(emoji: EmojiClickData) {
    onChange(emoji.emoji);
    setOpen(false);
  }

  return (
    <div className="flex">
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Choose your emoji"
        aria-describedby={describedBy}
        autoComplete="off"
        className="rounded-r-none"
        disabled
        required
      />
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="-ml-px rounded-l-none"
            aria-label="Open emoji picker"
            aria-expanded={open}
          >
            <SmilePlusIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={6}
          className="w-auto overflow-hidden rounded-xl border-0 p-0 shadow-xl ring-1 ring-foreground/10"
        >
          <EmojiPicker
            className="notion-emoji-picker"
            onEmojiClick={selectEmoji}
            emojiStyle={"native" as EmojiStyle}
            theme={"dark" as Theme}
            width="min(320px, calc(100vw - 2rem))"
            height={352}
            searchPlaceholder="Search for an emoji…"
            lazyLoadEmojis
            autoFocusSearch
            previewConfig={{ showPreview: false }}
            style={pickerStyle}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
