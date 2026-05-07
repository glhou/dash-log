import type { badgeVariants } from "../components/ui/badge"
import type { VariantProps } from "class-variance-authority"

export const LogLevel = {
  Debug: 10,
  Info: 20,
  Warning: 30,
  Error: 40,
  Critical: 50
} as const

export type LogLevel = typeof LogLevel[keyof typeof LogLevel]


export const LogLevelLabel: Record<LogLevel, string> = {
  [LogLevel.Debug]: 'Debug',
  [LogLevel.Info]: 'Info',
  [LogLevel.Warning]: 'Warning',
  [LogLevel.Error]: 'Error',
  [LogLevel.Critical]: 'Critical',
}

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"]

export const LogLevelVariant: Record<LogLevel, BadgeVariant> = {
  [LogLevel.Debug]: "debug",
  [LogLevel.Info]: "info",
  [LogLevel.Warning]: "warning",
  [LogLevel.Error]: "destructive",
  [LogLevel.Critical]: "critical",
}

export interface Message {
  level: LogLevel
  message: string
}

export interface MessageOutput<T> {
  result: T
  messages: Message[]
}
