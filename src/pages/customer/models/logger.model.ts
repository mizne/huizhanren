export interface Logger {
  id?: string
  time?: string
  level: LoggerLevel
  content: string
}

export type LoggerLevel = 'info' | 'warn' | 'error' | 'sys'