export interface Goal {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  startsOn: string;
  endsOn: string | null;
}

export type GoalDraft = Omit<Goal, "id">;
export type GoalUpdater = (current: Goal[]) => Goal[];
export type GoalFilter = "all" | "active" | "completed";
