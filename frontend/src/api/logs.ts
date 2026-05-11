import type { LogLevel, MessageOutput } from "./types"

export interface Log {
  id: number
  service: string
  level: LogLevel
  message: string
  logger: string
  created_at: string
}

export type LogsResponse = MessageOutput<Log[]>

export interface LogFilter {
  service: string | null
  logger: string | null
  level: LogLevel | null
  limit: number | null
  offset: number | null
  order_by: string | null
  order_dir: "asc" | "desc" | null
}

export async function fetchLogs(params: LogFilter): Promise<LogsResponse> {
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      urlParams.set(key, String(value))
    }
  })
  const res = await fetch(`/api/log?${urlParams}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}

type ServicesResponse = MessageOutput<string[]>

export async function fetchServices(): Promise<ServicesResponse> {
  const res = await fetch("/api/log/services")
  if (!res.ok) throw new Error("Failed to fetch services")
  return res.json()
}

type LoggersResponse = MessageOutput<string[]>

export async function fetchLoggers(service: string): Promise<LoggersResponse> {
  const res = await fetch(`/api/log/services/${service}/loggers`)
  if (!res.ok) throw new Error("Failed to fetch loggers")
  return res.json()
}
