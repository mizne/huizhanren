export class Visitor {
  id?: string
  name?: string
  title?: string
  company?: string
  companyAddr?: string
  industry?: string
  area?: string
  mobile?: string
  cardImg?: string
  email?: string
  website?: string
  selected?: boolean
  headImgUrl?: string

  static convertFromResp(resp: VisitorResp): Visitor {
    return {
      id: resp.RecordId,
      name: resp.Name,
      title: resp.Job,
      company: resp.CompanyName,
      companyAddr: resp.CompAddr,
      industry: resp.Industry,
      area: resp.Province,
      mobile: resp.Mob,
      cardImg: resp.Card,
      email: resp.Email,
      website: resp.Website,
      headImgUrl: resp.HeadImgUrl
    }
  }

  static generateFakeVisitors(start: number, end: number): Visitor[] {
    const results = []
    for (let i = start; i < end; i += 1) {
      results.push({
        id: 'recommend-' + String(i),
        name: `张${i}`,
        title: `经理${i}`,
        company: `移动公司${i}`,
        industry: i % 2 === 0 ? `互联网${i}` : '',
        area: `上海${i}`
      })
    }
    return results
  }
}

export class VisitorResp {
  RecordId?: string
  Name: string
  Mob: string
  Sex: string
  Email: string
  Dept: string
  Job: string
  Industry?: string

  Country: string
  Province: string
  City: string
  County: string

  CompAddr: string
  CompanyName: string

  HeadImgUrl: string
  Card?: string
  Website?: string

  Objective: string
  Remark: string
}

export interface VisitorFilter {
  area?: string
  type?: string
  key?: string
}

export interface FetchVisitorParams extends VisitorFilter {
  pageSize?: number
  pageIndex?: number
}

export interface CreateMatcherParams {
  Organizer?: string
  OrganizerId?: string
  Name?: string
  CompName?: string
  Mob?: string
  JobTitle?: string
  Province?: string
  Email?: string
  VisitorAddr?: string
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  VISITOR,
  TODO,
  COMPLETE
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
  BATCH_DELETE,
  REFRESH
}

export interface FilterOptions {
  label: string
  value: string
}
