import { Heading } from "@/components/ui/heading";
import * as React from "react";

interface ClockContainerProps {
  children: React.ReactNode;
}

export default function TimelineContainer({ children }: ClockContainerProps) {
  return (
    <div className="min-w-0 w-full gap-4 flex flex-col">
      <Heading as="h2" className="text-2xl">
        Timeline
      </Heading>
      <div className="relative rounded-xl overflow-hidden bg-accent/20 backdrop-blur-2xl border border-white/5">
        <div className="flex flex-col p-4 gap-2 overflow-y-auto scrollbar-none min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
