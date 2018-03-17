export enum VisitorLoggerLevel {
  INFO,
  WARN,
  ERROR,
  SYS
}

export class VisitorLogger {
  id?: string
  time?: string
  level: VisitorLoggerLevel
  content: string
  visitorId?: string

  static convertFromResp(resp: VisitorLoggerResp): VisitorLogger {
    return {
      id: resp.RecordId,
      time: resp.CreatedAt,
      level: resp.level,
      content: resp.info,
      visitorId: resp.visitorId
    }
  }

  static convertFromModel(log: VisitorLogger): VisitorLoggerResp {
    return {
      level: log.level,
      info: log.content,
      visitorId: log.visitorId
    }
  }
}

export interface VisitorLoggerResp {
  RecordId?: string
  CreatedAt?: string
  level: number
  info: string
  visitorId: string
}
