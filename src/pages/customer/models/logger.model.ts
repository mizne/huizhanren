export enum LoggerLevel {
  INFO,
  WARN,
  ERROR,
  SYS
}

export class Logger {
  id?: string
  time?: string
  level: LoggerLevel
  content: string

  static convertFromResp(resp: LoggerResp): Logger {
    return {
      id: resp.RecordId,
      time: resp.CreatedAt,
      level: resp.level,
      content: resp.info
    }
  }

  static convertFromModel(log: Logger): LoggerResp {
    return {
      level: log.level,
      info: log.content
    }
  }

  static generateSysLoggerForSms(templateLabel: string): Logger {
    return {
      level: LoggerLevel.SYS,
      content: `系统: 发送 【${templateLabel}】 短信成功!`
    }
  }

  static generateSysLoggerForScanCard(): Logger {
    return {
      level: LoggerLevel.SYS,
      content: '系统: 扫描名片并保存成功'
    }
  }

  static generateFakeLogs(length: number): Logger[] {
    return Array.from({ length }, (_, i) => ({
      id: String(i),
      time: '2017-12-22 11:12:11',
      level: i % 4,
      content: `test content ${i}`
    }))
  }
}

export interface LoggerResp {
  RecordId?: string
  CreatedAt?: string
  level: number
  info: string
}
