import { BriefcaseBusinessIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function HabitsCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-muted p-4">
      <div className="flex flex-row gap-2">
        <BriefcaseBusinessIcon />
        <h2>Work</h2>
      </div>
      <span>Weekly (1, 2, 3, 4, 5)</span>
      <span>08:00 - 12:00 / 13:30 - 18:00</span>
      <Button variant="outline">Edit Habit</Button>
    </div>
  );
}
