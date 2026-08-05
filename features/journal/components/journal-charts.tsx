"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartNoAxesCombinedIcon, MoonStarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { MOOD_OPTIONS } from "../journal.data";
import type {
  ConsistencyDataPoint,
  WellbeingDataPoint,
} from "../journal.utils";

const consistencyConfig = {
  habits: { label: "Habits", color: "#a3e635" },
  goals: { label: "Goals", color: "#38bdf8" },
} satisfies ChartConfig;

const wellbeingConfig = {
  sleep: { label: "Sleep", color: "#818cf8" },
  mood: { label: "Mood", color: "#fb7185" },
} satisfies ChartConfig;

interface JournalChartsProps {
  monthLabel: string;
  consistency: ConsistencyDataPoint[];
  wellbeing: WellbeingDataPoint[];
}

export function JournalCharts({
  monthLabel,
  consistency,
  wellbeing,
}: JournalChartsProps) {
  const hasConsistency = consistency.some(
    (point) => point.habits !== null || point.goals !== null,
  );
  const hasWellbeing = wellbeing.some(
    (point) => point.sleep !== null || point.mood !== null,
  );

  return (
    <section
      className="grid gap-4 lg:grid-cols-2"
      aria-label="Monthly insights"
    >
      <Card className="min-h-80 gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div className="flex flex-col">
            <CardTitle>Consistency rhythm</CardTitle>
            <CardDescription>
              Daily completion rate for {monthLabel.toLowerCase()}.
            </CardDescription>
          </div>
          <div className="mt-2 flex gap-3 text-[10px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#a3e635]" /> Habits
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#38bdf8]" /> Goals
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-64 flex-1 items-center py-4">
          {hasConsistency ? (
            <ChartContainer
              config={consistencyConfig}
              className="h-56 w-full aspect-auto"
            >
              <LineChart
                accessibilityLayer
                data={consistency}
                margin={{ top: 8, right: 8, bottom: 0, left: -5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 5" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={20}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 50, 100]}
                  tickFormatter={(value) => `${value}%`}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                />
                <ReferenceLine
                  y={80}
                  stroke="var(--muted-foreground)"
                  strokeOpacity={0.22}
                  strokeDasharray="4 4"
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(_, payload) =>
                        payload[0]?.payload?.label ?? ""
                      }
                    />
                  }
                />
                <Line
                  dataKey="habits"
                  type="monotone"
                  stroke="var(--color-habits)"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "var(--card)",
                    stroke: "var(--color-habits)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
                <Line
                  dataKey="goals"
                  type="monotone"
                  stroke="var(--color-goals)"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "var(--card)",
                    stroke: "var(--color-goals)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="Complete a habit or goal to begin this line." />
          )}
        </CardContent>
      </Card>

      <Card className="min-h-80 gap-0 py-0">
        <CardHeader className="border-b py-4">
          <div className="flex flex-col">
            <CardTitle>Sleep & mood</CardTitle>
            <CardDescription>
              See how your nightly rest moves with your daily mood.
            </CardDescription>
          </div>
          <div className="mt-2 flex gap-3 text-[10px] font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#818cf8]" /> Sleep hours
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[#fb7185]" /> Mood score
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-64 flex-1 items-center py-4">
          {hasWellbeing ? (
            <ChartContainer
              config={wellbeingConfig}
              className="h-56 w-full aspect-auto"
            >
              <LineChart
                accessibilityLayer
                data={wellbeing}
                margin={{ top: 8, right: -6, bottom: 0, left: -12 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 5" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={20}
                />
                <YAxis
                  yAxisId="sleep"
                  domain={[0, 10]}
                  ticks={[0, 5, 10]}
                  tickFormatter={(value) => `${value}h`}
                  tickLine={false}
                  axisLine={false}
                  width={38}
                />
                <YAxis
                  yAxisId="mood"
                  orientation="right"
                  domain={[1, 5]}
                  ticks={[1, 3, 5]}
                  tickFormatter={(value) =>
                    MOOD_OPTIONS.find((option) => option.score === value)
                      ?.emoji ?? ""
                  }
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <ReferenceLine
                  yAxisId="sleep"
                  y={8}
                  stroke="var(--muted-foreground)"
                  strokeOpacity={0.22}
                  strokeDasharray="4 4"
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelFormatter={(_, payload) =>
                        payload[0]?.payload?.label ?? ""
                      }
                    />
                  }
                />
                <Line
                  yAxisId="sleep"
                  dataKey="sleep"
                  type="monotone"
                  stroke="var(--color-sleep)"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "var(--card)",
                    stroke: "var(--color-sleep)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
                <Line
                  yAxisId="mood"
                  dataKey="mood"
                  type="monotone"
                  stroke="var(--color-mood)"
                  strokeWidth={2.5}
                  dot={{
                    r: 3,
                    fill: "var(--card)",
                    stroke: "var(--color-mood)",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="Add sleep and mood entries to reveal a pattern." />
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="mx-auto flex max-w-64 flex-col items-center gap-2 text-center text-sm text-muted-foreground">
      <span className="flex size-10 items-center justify-center rounded-full border border-dashed">
        <ChartNoAxesCombinedIcon className="size-4" aria-hidden="true" />
      </span>
      {message}
    </div>
  );
}
