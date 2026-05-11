import type { LogsResponse } from "./logs"
import type { LogLevel, MessageOutput } from "./types"


export async function getAlertLogs(start: string, end: string, limit: number): Promise<LogsResponse> {
  const res = await fetch(`/api/dashboard/stats/alert?start_time=${start}&end_time=${end}&limit=${limit}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}

interface LoggerOccurence {
  logger: string
  occurence: number
}

type LoggerOccurenceResponse = MessageOutput<LoggerOccurence[]>;

export async function getLoggerOccurence(start: string, end: string): Promise<LoggerOccurenceResponse> {
  const res = await fetch(`/api/dashboard/stats/logger-occurence?start_time=${start}&end_time=${end}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}


interface LevelOccurence {
  level: LogLevel
  occurence: number
}
type LevelOccurenceResponse = MessageOutput<LevelOccurence[]>;

export async function getLevelOccurence(start: string, end: string): Promise<LevelOccurenceResponse> {
  const res = await fetch(`/api/dashboard/stats/level?start_time=${start}&end_time=${end}`)
  if (!res.ok) throw new Error('Failed to fetch logs')
  return res.json()
}
