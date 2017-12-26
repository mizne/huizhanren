const levelStrings: LoggerLevel[] = ['info', 'warn', 'error', 'sys']
export class Logger {
  id?: string
  time?: string
  level: LoggerLevel
  content: string

  static convertFromResp(resp: LoggerResp): Logger {
    return {
      id: resp.RecordId,
      time: resp.CreatedAt,
      level: levelStrings[resp.level],
      content: resp.info
    }
  }

  static convertFromModel(log: Logger): LoggerResp {
    return {
      level: levelStrings.indexOf(log.level),
      info: log.content
    }
  }

  static generateFakeLogs(length: number): Logger[] {
    return Array.from({ length }, (_, i) => ({
      id: String(i),
      time: '2017-12-22 11:12:11',
      level: levelStrings[i % 4],
      content: `test content ${i}`
    }))
  }
}

export type LoggerLevel = 'info' | 'warn' | 'error' | 'sys'

export interface LoggerResp {
  RecordId?: string
  CreatedAt?: string
  level: number
  info: string
}
