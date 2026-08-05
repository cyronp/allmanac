import type { SubmitEventHandler } from "react";
import { Trash2Icon, TriangleAlertIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Textarea } from "@/components/ui/textarea";

import type { GoalDraft } from "../goals.types";
import { GoalEmojiPicker } from "./goal-emoji-picker";

interface GoalDialogProps {
  open: boolean;
  editing: boolean;
  draft: GoalDraft;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: GoalDraft) => void;
  onDelete: () => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

export function GoalDialog({
  open,
  editing,
  draft,
  onOpenChange,
  onDraftChange,
  onDelete,
  onSubmit,
}: GoalDialogProps) {
  const datesAreValid = !draft.endsOn || draft.endsOn >= draft.startsOn;
  const canSubmit = Boolean(
    draft.title.trim() &&
      draft.emoji.trim() &&
      draft.startsOn &&
      datesAreValid,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editing ? "Edit goal" : "Create a new goal"}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? "Update the goal details."
                : "Set the details for this goal."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-6">
            <div className="grid gap-2">
              <Label htmlFor="goal-title">Goal title</Label>
              <Input
                id="goal-title"
                value={draft.title}
                onChange={(event) =>
                  onDraftChange({ ...draft, title: event.target.value })
                }
                placeholder="e.g. Run my first half marathon"
                autoFocus
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="goal-description">Description</Label>
              <Textarea
                id="goal-description"
                value={draft.description}
                onChange={(event) =>
                  onDraftChange({ ...draft, description: event.target.value })
                }
                placeholder="Add a short description."
                className="min-h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="goal-start">Start date</Label>
                <Input
                  id="goal-start"
                  type="date"
                  value={draft.startsOn}
                  onChange={(event) =>
                    onDraftChange({ ...draft, startsOn: event.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal-deadline">
                  Deadline{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  min={draft.startsOn}
                  value={draft.endsOn ?? ""}
                  onChange={(event) =>
                    onDraftChange({
                      ...draft,
                      endsOn: event.target.value || null,
                    })
                  }
                  aria-invalid={!datesAreValid}
                />
              </div>
            </div>
            {!datesAreValid && (
              <p className="-mt-3 text-xs text-destructive">
                The deadline must be on or after the start date.
              </p>
            )}
            {datesAreValid && (
              <p className="-mt-3 text-xs text-muted-foreground">
                {draft.endsOn
                  ? "Progress is calculated automatically from these dates."
                  : "Goals without a deadline do not show progress."}
              </p>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="goal-icon">Icon</Label>
                <GoalEmojiPicker
                  id="goal-icon"
                  value={draft.emoji}
                  onChange={(emoji) => onDraftChange({ ...draft, emoji })}
                  describedBy="goal-icon-hint"
                />
                <p id="goal-icon-hint" className="text-xs text-muted-foreground">
                  Pick an emoji on the emoji selector.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="goal-background">Background color</Label>
                <div className="flex h-8 items-center gap-2">
                  <input
                    id="goal-background"
                    type="color"
                    value={draft.color}
                    onChange={(event) =>
                      onDraftChange({ ...draft, color: event.target.value })
                    }
                    className="h-8 w-12 cursor-pointer rounded-lg"
                  />
                  <code className="text-sm uppercase text-muted-foreground">
                    {draft.color}
                  </code>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pick any color for the goal card.
                </p>
              </div>
            </div>

          </div>

          <DialogFooter className="items-center sm:justify-between">
            {editing ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2Icon data-icon="inline-start" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive">
                      <TriangleAlertIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. &quot;{draft.title}&quot; will
                      be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={onDelete}>
                      Delete goal
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <span />
            )}
            <Button type="submit" disabled={!canSubmit}>
              {editing ? "Save changes" : "Create goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
