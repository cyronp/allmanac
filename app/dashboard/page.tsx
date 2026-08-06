import { format } from "date-fns";
import { connection } from "next/server";

import DashboardLocal from "@/components/dashboard/dashboard-local";

export default async function DashboardPage() {
  await connection();

  return <DashboardLocal today={format(new Date(), "yyyy-MM-dd")} />;
}
