import type { LogLevel, MessageOutput } from "./types"

export interface Log {
  id: number
  service: string
  level: LogLevel
  message: string
}

type LogsResponse = MessageOutput<Log[]>

export async function fetchLogs(): Promise<LogsResponse> {
  const res = await fetch("/api/log")
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}
