import { useQuery } from "@tanstack/react-query"
import { getAlertLogs, getLevelOccurence, getLoggerOccurence } from "../api/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import LogTable from "../components/LogTable"
import { useState } from "react"
import { LogLevel } from "../api/types"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "../components/ui/chart"
import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts"

export default function Dashboard() {
  const [page, setPage] = useState(0)
  const now = new Date()
  const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const end = now.toISOString()
  const limit = 10

  const { data: alertLogs } = useQuery({
    queryKey: ["alertLogs"],
    queryFn: () => getAlertLogs(start, end, limit),
  })


  const { data: loggerOccurence } = useQuery({
    queryKey: ["loggerOccuence"],
    queryFn: () => getLoggerOccurence(start, end),
  })


  const { data: levelOccurence } = useQuery({
    queryKey: ["levelOccuence"],
    queryFn: () => getLevelOccurence(start, end),
  })

  const levelChartConfig = {
    [LogLevel.Debug]: {
      label: "Debug",
      color: "var(--color-pink-100)",
    },
    [LogLevel.Info]: {
      label: "Info",
      color: "var(--color-green-100)",
    },
    [LogLevel.Warning]: {
      label: "Warning",
      color: "var(--color-orange-100)",
    },
    [LogLevel.Error]: {
      label: "Error",
      color: "var(--color-destructive)",
    },
    [LogLevel.Critical]: {
      label: "Critical",
      color: "var(--color-red-600)",
    },
  } satisfies ChartConfig

  const loggerChartConfig = {
    occurence: {
      label: "Frequency",
      color: "var(--chart-1)",
    }
  } satisfies ChartConfig

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4"> Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Level frequence</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {levelOccurence?.result ?
              <ChartContainer
                config={levelChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={levelOccurence?.result}
                    dataKey="occurence"
                    nameKey="level"
                    className="fill-(--color-desktop)"
                    innerRadius={40} />
                </PieChart>
              </ChartContainer>
              : <span />
            }
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Logger frequence</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {loggerOccurence?.result ?
              <ChartContainer config={loggerChartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={loggerOccurence.result}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="logger"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 10) + "..."}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="occurence" fill="var(--color-desktop)" radius={1} />
                </BarChart>
              </ChartContainer>
              : <span />
            }
          </CardContent>
        </Card>
        <Card className="col-span-2">
          <LogTable
            logResponse={alertLogs}
            page={page}
            setPage={setPage}
            pageItemLimit={limit}
          />
        </Card>
      </div>
    </div>
  )
}
