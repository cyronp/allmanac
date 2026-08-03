"use client";

import { useState, type ReactNode } from "react";

import TimelineToolbar from "./timeline-toolbar";
import TimelineTrack, { type TimelineEntry } from "./timeline-track";

export type { TimelineEntry } from "./timeline-track";

interface TimelineProps {
  children?: ReactNode;
  events?: TimelineEntry[];
}

export default function Timeline({ children, events }: TimelineProps) {
  const [date, setDate] = useState<Date | undefined>(() => new Date());

  return (
    <div className="flex min-w-0 w-full flex-col gap-2">
      <TimelineToolbar date={date} onDateChange={setDate} />
      <TimelineTrack date={date} events={events}>
        {children}
      </TimelineTrack>
    </div>
  );
}
