import { format } from "date-fns";
import { connection } from "next/server";

import { GoalsPage } from "@/features/goals/goals-page";

export default async function GoalsRoute() {
  await connection();

  return <GoalsPage today={format(new Date(), "yyyy-MM-dd")} />;
}
