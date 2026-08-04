import type { SubmitEventHandler } from "react";
import { CheckIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { CATEGORY_STYLES, DAYS_OF_WEEK } from "../habits.config";
import { habitCategories, type HabitDraft } from "../habits.types";
import { toast } from "sonner";

const HandleSubmit = () => {
  try {
    toast.success("Habit created sucessfully!")
  } catch {
    toast.error("Opsss, we ocurred a error creating your habit!")
  }
}

interface HabitDialogProps {
  open: boolean;
  editing: boolean;
  draft: HabitDraft;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: HabitDraft) => void;
  onToggleDay: (day: number) => void;
  onDelete: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

export function HabitDialog({
  open,
  editing,
  draft,
  onOpenChange,
  onDraftChange,
  onToggleDay,
  onDelete,
  onSubmit,
}: HabitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-lg">
        <form onSubmit={HandleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editing ? "Edit habit" : "Create a new habit"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update this routine so it keeps working for you."
                : "Choose what you want to do and when it belongs in your week."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="habit-name">Habit name</Label>
              <Input
                id="habit-name"
                value={draft.name}
                onChange={(event) =>
                  onDraftChange({ ...draft, name: event.target.value })
                }
                placeholder="e.g. Plan tomorrow"
                autoFocus
                required
              />
            </div>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Life area</legend>
              <div className="grid grid-cols-3 gap-2">
                {habitCategories.map((key) => {
                  const category = CATEGORY_STYLES[key];
                  const Icon = category.icon;
                  const selected = draft.category === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onDraftChange({ ...draft, category: key })}
                      className={cn(
                        "relative flex min-h-16 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        selected
                          ? "border-primary bg-primary/10 text-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      {category.label}
                      {selected && (
                        <CheckIcon className="absolute right-1.5 top-1.5 size-3 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset className="grid gap-2">
              <legend className="text-sm font-medium">Repeat on</legend>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map((day, index) => {
                  const selected = draft.days.includes(index);

                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onToggleDay(index)}
                      className={cn(
                        "flex aspect-square cursor-pointer items-center justify-center rounded-lg border text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                        selected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {day.slice(0, 1)}
                      <span className="sr-only">{day}</span>
                    </button>
                  );
                })}
              </div>
              {draft.days.length === 0 && (
                <p className="text-xs text-destructive">
                  Choose at least one day.
                </p>
              )}
            </fieldset>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="habit-start">Starts at</Label>
                <Input
                  id="habit-start"
                  type="time"
                  value={draft.startTime}
                  onChange={(event) =>
                    onDraftChange({ ...draft, startTime: event.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="habit-end">Ends at</Label>
                <Input
                  id="habit-end"
                  type="time"
                  value={draft.endTime}
                  onChange={(event) =>
                    onDraftChange({ ...draft, endTime: event.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="items-center sm:justify-between">
            {editing ? (
              <Button type="button" variant="destructive" onClick={onDelete}>
                <Trash2Icon data-icon="inline-start" />
                Delete
              </Button>
            ) : (
              <span />
            )}
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!draft.name.trim() || draft.days.length === 0}
              >
                {editing ? "Save changes" : "Create habit"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
