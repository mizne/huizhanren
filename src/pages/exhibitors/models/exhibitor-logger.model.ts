export enum ExhibitorLoggerLevel {
  INFO,
  WARN,
  ERROR,
  SYS
}

export class ExhibitorLogger {
  id?: string
  time?: string
  level: ExhibitorLoggerLevel
  content: string
  exhibitorId?: string
  exhibitionId?: string

  static convertFromResp(resp: ExhibitorLoggerResp): ExhibitorLogger {
    return {
      id: resp.RecordId,
      time: resp.CreatedAt,
      level: resp.level,
      content: resp.info,
      exhibitorId: resp.ExhibitorId,
      exhibitionId: resp.ExhibitionId
    }
  }

  static convertFromModel(log: ExhibitorLogger): ExhibitorLoggerResp {
    return {
      level: log.level,
      info: log.content,
      ExhibitorId: log.exhibitorId,
      ExhibitionId: log.exhibitionId
    }
  }
}

export interface ExhibitorLoggerResp {
  RecordId?: string
  CreatedAt?: string
  level: number
  info: string
  ExhibitorId: string
  ExhibitionId: string
}
