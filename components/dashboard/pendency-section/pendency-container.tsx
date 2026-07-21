"use client";

import { Heading } from "@/components/ui/heading";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface PendencyContainerProps {
  title: string;
  href: string;
  children: React.ReactNode;
}

export default function PendencyContainer({
  title,
  href,
  children,
}: PendencyContainerProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const isDraggingRef = React.useRef(false);
  const dragState = React.useRef({ startY: 0, scrollTop: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;

    isDraggingRef.current = true;
    setIsDragging(true);
    dragState.current = {
      startY: e.clientY,
      scrollTop: e.currentTarget.scrollTop,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;

    e.preventDefault();
    e.currentTarget.scrollTop =
      dragState.current.scrollTop - (e.clientY - dragState.current.startY);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <Heading
        asChild
        as="h2"
        className="group text-2xl flex items-center gap-1 hover:underline decoration-2"
      >
        <Link href={href}>
          {title}
          <ArrowUpRight className="group-hover:-translate-y-1 group-hover:translate-x-1 duration-200 transition-all" />
        </Link>
      </Heading>
      <div className="relative rounded-xl overflow-hidden bg-accent/20 backdrop-blur-2xl border border-white/5">
        <div
          className={cn(
            "flex max-h-56 flex-col gap-2 overflow-y-auto p-4 select-none scrollbar-none",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
