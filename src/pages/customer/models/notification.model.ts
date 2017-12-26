export class Notification {
  id?: string
  time?: string
  content: string
  expired?: boolean

  static convertFromResp(resp: NotificationResp): Notification {
    return {
      id: resp.RecordId,
      time: resp.RemindDate,
      content: resp.RemindContent
    }
  }
}

export interface NotificationResp {
  RecordId: string
  RemindDate: string
  RemindContent: string
}
