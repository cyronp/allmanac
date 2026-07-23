import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
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
      <ScrollArea
        type="always"
        className="h-56 rounded-xl border border-white/5 bg-accent/20 backdrop-blur-2xl"
      >
        <div className="flex flex-col gap-2 p-4 pr-6">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
}
