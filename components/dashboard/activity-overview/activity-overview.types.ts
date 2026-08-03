export type CompletionOverrides = Record<string, boolean>;

export interface DayGoal {
  color: string;
  completed: boolean;
  emoji: string;
  id: string;
  title: string;
}

export interface DayProgress {
  completed: number;
  goals: DayGoal[];
  percentage: number;
  total: number;
}

export interface GoalConsistencyDatum {
  completed: number;
  emoji: string;
  fill: string;
  id: string;
  percentage: number;
  title: string;
  total: number;
}
