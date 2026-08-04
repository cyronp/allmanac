"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import dynamic from "next/dynamic";
import { SmilePlusIcon } from "lucide-react";
import type {
  EmojiClickData,
  EmojiStyle,
  Theme,
} from "emoji-picker-react";

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
      className="flex h-80 w-80 max-w-[calc(100vw-2rem)] items-center justify-center text-sm text-muted-foreground"
      role="status"
    >
      Loading emoji picker…
    </div>
  ),
});

const pickerStyle = {
  "--epr-picker-border-color": "var(--border)",
  "--epr-dark-picker-border-color": "var(--border)",
  "--epr-bg-color": "var(--popover)",
  "--epr-dark-bg-color": "var(--popover)",
  "--epr-category-label-bg-color": "var(--popover)",
  "--epr-dark-category-label-bg-color": "var(--popover)",
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
      <Popover open={open} onOpenChange={setOpen}>
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
          className="w-auto overflow-hidden p-0"
        >
          <EmojiPicker
            onEmojiClick={selectEmoji}
            emojiStyle={"native" as EmojiStyle}
            theme={"dark" as Theme}
            width="min(320px, calc(100vw - 2rem))"
            height={360}
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
