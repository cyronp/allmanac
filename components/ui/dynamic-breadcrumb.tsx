"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, SlashIcon } from "lucide-react";

interface DynamicBreadcrumbProps {
  className?: string;
}

const segmentMap: Record<string, string> = {
  api: "API",
  id: "ID",
  dashboard: "Dashboard",
};

const formatSegment = (segment: string) => {
  if (segmentMap[segment.toLowerCase()]) {
    return segmentMap[segment.toLowerCase()];
  }
  const clean = segment.replace(/[-_]/g, " ");
  return clean.replace(/\b\w/g, (char) => char.toUpperCase());
};

export function DynamicBreadcrumb({ className }: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  if (!pathname) return null;

  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const path = `/${segments.slice(0, index + 1).join("/")}`;
          const isLast = index === segments.length - 1;
          const formattedName = formatSegment(segment);
          const showHomeIcon = index === 0;

          return (
            <React.Fragment key={path}>
              {index > 0 && <BreadcrumbSeparator><SlashIcon strokeWidth={3}/></BreadcrumbSeparator>}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1">
                    {showHomeIcon && <Home className="h-4 w-4" />}
                    {formattedName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={path} className="flex items-center gap-1">
                      {showHomeIcon && <Home className="h-4 w-4" />}
                      {formattedName}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
