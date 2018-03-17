export enum ContactLoggerLevel {
  INFO,
  WARN,
  ERROR,
  SYS
}

export class ContactLogger {
  id?: string
  time?: string
  level: ContactLoggerLevel
  content: string
  contactId?: string

  static convertFromResp(resp: LoggerResp): ContactLogger {
    return {
      id: resp.RecordId,
      time: resp.CreatedAt,
      level: resp.level,
      content: resp.info,
      contactId: resp.contactId
    }
  }

  static convertFromModel(log: ContactLogger): LoggerResp {
    return {
      level: log.level,
      info: log.content,
      contactId: log.contactId
    }
  }

  static generateSysLoggerForSms(templateLabel: string): ContactLogger {
    return {
      level: ContactLoggerLevel.SYS,
      content: `系统: 发送 【${templateLabel}】 短信成功!`
    }
  }

  static generateSysLoggerForScanCard(): ContactLogger {
    return {
      level: ContactLoggerLevel.SYS,
      content: '系统: 扫描名片并保存成功'
    }
  }

  static generateFakeLogs(length: number): ContactLogger[] {
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
  contactId: string
}
