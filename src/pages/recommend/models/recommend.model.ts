export class Customer {
  id?: string
  name?: string
  title?: string
  company?: string
  industry?: string
  area?: string
  organizer?: string
  organizerId?: string
  mobile?: string
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
      area: resp.Province,
      organizer: resp.Organizer,
      organizerId: resp.OrganizerId,
      mobile: resp.Mob
    }
  }

  static convertFromModel(model: Recommend): RecommendResp {
    return {
      Organizer: model.organizer,
      OrganizerId: model.organizerId,
      Name: model.name,
      CompName: model.company,
      Mob: model.mobile,
      JobTitle: model.title,
      Province: model.area,
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
  Organizer?: string
  OrganizerId?: string
  Mob?: string
  Province?: string
}

export interface RecommendFilter {
  area: string,
  type: string,
  key: string
}

export interface FetchRecommendParams {
  pageSize?: number
  pageIndex?: number
  key?: string
  area?: string
  type?: string
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
