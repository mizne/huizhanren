export class Visitor {
  id?: string
  name?: string
  title?: string
  company?: string
  companyAddr?: string
  industry?: string
  area?: string
  organizer?: string
  organizerId?: string
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
      title: resp.JobTitle,
      company: resp.CompName,
      industry: resp.Industry,
      area: resp.Province,
      organizer: resp.Organizer,
      organizerId: resp.OrganizerId,
      mobile: resp.Mob,
      cardImg: resp.Card,
      email: resp.Email
    }
  }

  static convertFromModel(model: RecommendVisitor): CreateMatcherParams {
    return {
      Organizer: model.organizer,
      OrganizerId: model.organizerId,
      Name: model.name,
      CompName: model.company,
      Mob: model.mobile,
      JobTitle: model.title,
      Province: model.area,
      Email: model.email,
      VisitorAddr: model.companyAddr
    }
  }
}

export class RecommendVisitorResp {
  _id?: string
  TenantId?: string
  RecordId?: string
  Name?: string
  JobTitle?: string
  CompName?: string
  CompAddr?: string
  Industry?: string
  Organizer?: string
  OrganizerId?: string
  Mob?: string
  Province?: string
  Card?: string
  Email?: string
}

export interface RecommendVisitorFilter {
  area?: string,
  type?: string,
  key?: string
}

export interface FetchRecommendVisitorParams extends RecommendVisitorFilter {
  pageSize?: number
  pageIndex?: number
}

export interface CreateMatcherParams {
  Organizer?: string,
  OrganizerId?: string,
  Name?: string,
  CompName?: string,
  Mob?: string,
  JobTitle?: string,
  Province?: string,
  Email?: string,
  VisitorAddr?: string
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  VISITOR,
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
  BATCH_DELETE,
  REFRESH
}

export const AREA_OPTIONS = [
  {
    label: '不限区域',
    value:　''
  },
  {
    label: '北京市',
    value: 'beijing'
  },
  {
    label: '天津市',
    value: 'tianjin'
  },
  {
    label: '上海市',
    value: 'shanghai'
  },
  {
    label: '江苏省',
    value: 'jiangsu'
  },
  {
    label: '浙江省',
    value: 'zhejiang'
  },
  {
    label: '山东省',
    value: 'shandong'
  },
  {
    label: '湖北省',
    value: 'hubei'
  },
  {
    label: '安徽省',
    value: 'anhui'
  }
]
