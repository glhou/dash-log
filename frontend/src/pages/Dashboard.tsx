import { useQuery } from "@tanstack/react-query"
import { fetchLogs } from "../api/logs"
import { Skeleton } from "../components/ui/skeleton"
import { showMessages } from "../lib/toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { toast } from "sonner"
import { LogLevelLabel } from "../api/types"


export default function Dashboard() {
  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (error) {
    toast.error("Failed to load logs")
  }

  if (logs) showMessages(logs.messages)

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4"> Logs</h1>
      {logs && logs.result.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs?.result.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.service}</TableCell>
                <TableCell>{LogLevelLabel[log.level]}</TableCell>
                <TableCell>{log.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) :
        (<div>No log found</div>)
      }
    </div>
  )
}
