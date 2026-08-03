import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import type { GoalConsistencyDatum } from "@/components/dashboard/activity-overview/activity-overview.types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  percentage: {
    label: "Consistency",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

interface GoalConsistencyBarsProps {
  data: GoalConsistencyDatum[];
}

export default function GoalConsistencyBars({
  data,
}: GoalConsistencyBarsProps) {
  return (
    <>
      <div
        className="mb-2 grid items-end gap-2"
        style={{
          gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))`,
        }}
      >
        {data.map((goal) => (
          <div key={goal.id} className="min-w-0 text-center">
            <h3 className="truncate text-xs font-semibold" title={goal.title}>
              {goal.title}
            </h3>
            <p className="text-xs font-medium tabular-nums text-muted-foreground">
              {goal.percentage}%
            </p>
          </div>
        ))}
      </div>

      <ChartContainer
        config={chartConfig}
        initialDimension={{ width: 320, height: 210 }}
        className="h-52.5 min-h-52.5 w-full aspect-auto"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          <XAxis dataKey="title" type="category" hide />
          <YAxis type="number" domain={[0, 100]} hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                hideLabel
                hideIndicator
                formatter={(value, _name, item) => (
                  <div className="grid min-w-36 gap-1">
                    <span className="font-medium">
                      {String(item.payload.title)}
                    </span>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-muted-foreground">
                        Consistency
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {Number(value)}%
                      </span>
                    </div>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="percentage"
            radius={[8, 8, 4, 4]}
            maxBarSize={58}
            background={{ fill: "var(--muted)", radius: 8 }}
          >
            <LabelList
              dataKey="emoji"
              position="insideTop"
              offset={12}
              className="text-base"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
}
