import type { Metadata } from "next";
import { format } from "date-fns";
import { connection } from "next/server";

import { JournalPage } from "@/features/journal";

export const metadata: Metadata = {
  title: "Bullet journal | allmanac",
  description: "Track sleep, mood, habits, and goals in a monthly journal.",
};

export default async function JournalRoute() {
  await connection();
  const today = format(new Date(), "yyyy-MM-dd");

  return <JournalPage initialMonth={today.slice(0, 7)} today={today} />;
}

