export class Customer {
  id?: string
  name?: string
  title?: string
  company?: string
  industry?: string
  area?: string
}

export class Recommend extends Customer {
  selected?: boolean

  static convertFromResp(resp: RecommendResp): Recommend {
    return {
      id: resp.RecordId,
      name: resp.Name,
      title: resp.JobTitle,
      company: resp.CompName,
      industry: resp.Industry,
      area: resp.Area
    }
  }
}

export class RecommendResp {
  TenantId?: string
  RecordId?: string
  Name?: string
  JobTitle?: string
  CompName?: string
  Industry?: string
  Area?: string
}

export interface RecommendFilter {
  area: string,
  type: string,
  key: string
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  RECOMMEND,
  MATCHER
}

export enum PageStatus {
  LIST,
  DETAIL
}

export enum ListHeaderEvent {
  BATCH_INVITE,
  BATCH_HIDDEN,
  BATCH_ACCEPT,
  BATCH_REFUSE,
  BATCH_CANCEL,
  BATCH_DELETE
}
