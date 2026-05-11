import { useQuery } from "@tanstack/react-query"
import { fetchLoggers, fetchLogs, fetchServices, type LogFilter } from "../api/logs"
import { Skeleton } from "../components/ui/skeleton"
import { showMessages } from "../lib/toast"
import { toast } from "sonner"
import { Card, CardHeader } from "../components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Field, FieldLabel } from "../components/ui/field"
import { useState } from "react"
import LogTable from "../components/LogTable"


export default function Logs() {
  const [service, setService] = useState<string | null>(null)
  const [logger, setLogger] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const limit = 20

  const filters: LogFilter = {
    level: null,
    order_by: null,
    order_dir: null,
    service: service,
    logger: logger,
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

  const { data: loggers } = useQuery({
    queryKey: [
      "loggers",
      service
    ],
    queryFn: () => fetchLoggers(service ?? ""),
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
          <div className="flex flex-row">
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
            <Field>
              <FieldLabel>Logger</FieldLabel>
              <Select
                value={logger ?? ""}
                onValueChange={(value) => {
                  setLogger(value || null)
                }}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue placeholder="Select a logger" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem key="" value="">All</SelectItem>
                    {loggers?.result?.length ? (
                      loggers.result.map((logger) => (
                        <SelectItem
                          key={logger}
                          value={logger}
                        >
                          {logger}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        Select a service first
                      </div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardHeader>
        <LogTable
          logResponse={logs}
          page={page}
          setPage={setPage}
          pageItemLimit={limit}
        />
      </Card>
    </div>
  )
}
