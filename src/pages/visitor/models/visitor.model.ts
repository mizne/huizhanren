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
}

export class RecommendVisitor extends Visitor {
  selected?: boolean

  static convertFromResp(resp: RecommendVisitorResp): RecommendVisitor {
    return {
      id: resp.RecordId || resp._id,
      name: resp.Name,
      title: resp.Job,
      company: resp.CompanyName,
      industry: resp.Industry,
      area: resp.Province,
      mobile: resp.Mob,
      cardImg: resp.Card,
      email: resp.Email
    }
  }

  static convertFromModel(model: RecommendVisitor): CreateMatcherParams {
    return {
      Name: model.name,
      CompName: model.company,
      Mob: model.mobile,
      JobTitle: model.title,
      Province: model.area,
      Email: model.email,
      VisitorAddr: model.companyAddr
    }
  }

  static generateFakeVisitors(start: number, end: number): RecommendVisitor[] {
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

export class RecommendVisitorResp {
  _id?: string
  TenantId?: string
  RecordId?: string
  Name?: string
  Job?: string
  CompanyName?: string
  Industry?: string
  Mob?: string
  Province?: string
  Card?: string
  Email?: string
}

export interface VisitorFilter {
  area?: string
  type?: string
  key?: string
}

export interface FetchRecommendVisitorParams extends VisitorFilter {
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
