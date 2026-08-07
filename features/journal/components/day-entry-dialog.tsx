"use client";

import { useState, type FormEvent } from "react";
import { format, parseISO } from "date-fns";
import { SparklesIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

import { MOOD_OPTIONS } from "../journal.data";
import { copyEntry } from "../journal.store";
import type { JournalDayEntry } from "../journal.types";
import { MoodIcon } from "./mood-icon";
import { SleepClockSelector } from "./sleep-clock-selector";

interface DayEntryDialogProps {
  dateKey: string;
  entry?: JournalDayEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (dateKey: string, entry: JournalDayEntry) => void;
  onClear: (dateKey: string) => void;
}

export function DayEntryDialog({
  dateKey,
  entry,
  open,
  onOpenChange,
  onSave,
  onClear,
}: DayEntryDialogProps) {
  const [draft, setDraft] = useState(() => copyEntry(entry));
  const hasDailyLog = Boolean(draft.bedtime || draft.wakeTime || draft.mood);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSave(dateKey, draft);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-xl">
            {format(parseISO(dateKey), "EEEE, MMMM d")}
          </DialogTitle>
          <DialogDescription>
            Log last night&apos;s sleep and how the day felt. Your tracker marks
            are saved separately.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <SleepClockSelector
              bedtime={draft.bedtime}
              wakeTime={draft.wakeTime}
              onTimeChange={(kind, value) =>
                setDraft((current) => ({ ...current, [kind]: value }))
              }
            />
          </div>

          <Field>
            <FieldLabel className="flex items-center gap-2">
              <SparklesIcon className="size-4" aria-hidden="true" />
              How did you feel?
            </FieldLabel>
            <div
              className="grid grid-cols-3 gap-2 sm:grid-cols-5"
              role="group"
              aria-label="Choose a mood"
            >
              {MOOD_OPTIONS.map((option) => {
                const selected = draft.mood === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        mood: selected ? null : option.value,
                      }))
                    }
                    className={cn(
                      "flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border bg-background px-2 py-2 text-xs font-medium outline-none transition-all hover:-translate-y-0.5 hover:border-foreground/25 focus-visible:ring-3 focus-visible:ring-ring/50",
                      selected && option.className,
                    )}
                  >
                    <MoodIcon mood={option.value} className="size-11" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <DialogFooter className="items-center sm:justify-between">
            <Button
              type="button"
              variant="ghost"
              className="text-muted-foreground"
              disabled={!hasDailyLog}
              onClick={() => onClear(dateKey)}
            >
              <Trash2Icon data-icon="inline-start" />
              Clear log
            </Button>
            <Button type="submit">Save daily entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
