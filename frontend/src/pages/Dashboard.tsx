import { useQuery } from "@tanstack/react-query"
import { getAlertLogs, getLevelOccurence, getLoggerOccurence } from "../api/dashboard"
import { Card, CardHeader, CardTitle } from "../components/ui/card"
import LogTable from "../components/LogTable"
import { useState } from "react"

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

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4"> Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>PIE</CardTitle>
            {loggerOccurence?.result.forEach((v) => v) ?? ""}
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>KEYWORD FREQUENCE</CardTitle>
            {levelOccurence?.result.forEach((v) => v) ?? ""}
          </CardHeader>
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
