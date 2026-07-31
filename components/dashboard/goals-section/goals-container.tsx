import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import * as React from "react";

interface GoalsContainerProps {
  children: React.ReactNode;
}

export default function GoalsContainer({ children }: GoalsContainerProps) {
  return (
    <div className="min-w-0 w-full gap-4 flex flex-col">
      <Heading as="h2" className="text-2xl">
        Your Goals
      </Heading>
      <Card>
        <CardContent className="flex flex-col gap-2 lg:flex-row">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
