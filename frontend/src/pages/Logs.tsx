import { useQuery } from "@tanstack/react-query"
import { fetchLogs, fetchServices, type LogFilter } from "../api/logs"
import { Skeleton } from "../components/ui/skeleton"
import { showMessages } from "../lib/toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { toast } from "sonner"
import { LogLevelVariant, LogLevelLabel } from "../api/types"
import { Card, CardHeader } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Field, FieldLabel } from "../components/ui/field"
import { useState } from "react"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../components/ui/pagination"


export default function Logs() {
  const [service, setService] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const limit = 20

  const filters: LogFilter = {
    level: null,
    order_by: null,
    order_dir: null,
    service: service,
    limit: limit,
    offset: page * limit
  }

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["logs", filters],
    queryFn: () => fetchLogs(filters),
    enabled: service !== null,
  })

  const { data: services } = useQuery({
    queryKey: [
      "services"
    ],
    queryFn: fetchServices,
  })

  if (isLoading) return <Skeleton className="h-64 w-full" />
  if (error) {
    toast.error("Failed to load logs")
  }

  if (logs) showMessages(logs.messages)

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4"> Logs</h2>
      <Card className="p-6">
        <CardHeader>
          <Field>
            <FieldLabel>Service</FieldLabel>
            <Select
              value={service ?? ""}
              onValueChange={(value) => {
                setService(value || null)
              }}
            >
              <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {services?.result?.length ? (
                    services.result.map((service) => (
                      <SelectItem
                        key={service}
                        value={service}
                      >
                        {service}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1 text-sm text-muted-foreground">
                      No services found
                    </div>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </CardHeader>
        {logs && logs.result.length > 0 ? (
          <div>
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
                    <TableCell><Badge variant={LogLevelVariant[log.level]}>{LogLevelLabel[log.level]}</Badge></TableCell>
                    <TableCell>{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious size="default" href="#" onClick={() => setPage((p) => p > 0 ? p - 1 : 0)} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink size="default" href="#" isActive>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext size="default" href="#" onClick={() => setPage((p) =>
                    (logs?.result.length < limit && logs?.result.length > 0) ? p :
                      p + 1)} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        ) :
          (<div>No log found</div>)
        }
      </Card>
    </div>
  )
}
