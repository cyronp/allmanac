import { Heading } from "@/components/ui/heading";
import { ArrowRight, ArrowUpRight } from "lucide-react";
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
      <div className="relative rounded-xl overflow-hidden bg-accent/20 backdrop-blur-2xl">
        <div className="flex flex-col p-4 gap-2 max-h-75 overflow-y-auto scrollbar-none">
          {children}
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/5" />
      </div>
    </div>
  );
}
