export class Exhibitor {
  id?: string
  name?: string
  logo?: string
  booth?: string
  boothNo?: string
  exHall?: string
  industry?: string
  area?: string
  city?: string
  heat?: number
  products?: Product[]
  description?: string
  website?: string
  visitors?: Visitor[]
  organizer?: string
  organizerId?: string
}

export class RecommendExhibitor extends Exhibitor {
  selected?: boolean

  static convertFromResp(resp: RecommendExhibitorResp): RecommendExhibitor {
    return {
      id: resp.RecordId || resp._id,
      name: resp.companyName,
      logo: resp.logo || './assets/images/default_exhibitor.png',
      booth: resp.boothArea,
      boothNo: resp.BoothNo,
      exHall: resp.ExHall,
      industry: resp.Industry,
      area: resp.province,
      city: resp.city,
      heat: resp.heat || Math.round(Math.random() * 1000),
      products: (resp.ProductList || []).map(e => ({
        id: e.Name,
        name: e.Name,
        remark: e.Remark,
        pictures: e.PicList.map(f => f.PicPath)
      })),
      visitors: (resp.Visitors || []).map(e => ({
        id: e.id,
        headImgUrl: e.HeadImgUrl
      })),
      description: resp.Introduction,
      website: resp.website,
      organizer: resp.Organizer,
      organizerId: resp.OrganizerId,
      selected: false
    }
  }

  static convertFromModel(model: RecommendExhibitor): RecommendExhibitorResp {
    return {
      Organizer: model.organizer,
      OrganizerId: model.organizerId,
      companyName: model.name,
      city: model.city,
      boothArea: model.booth,
      ExHall: model.exHall
    }
  }

  static generateFakeExhibitors(start: number, end: number): RecommendExhibitor[] {
    const results = []
    for (let i = start; i < end; i += 1) {
      results.push({
        id: String(i),
      name: `展商特别长特别长特别长的名字${i}`,
      logo: './assets/images/card.jpg',
      booth: Math.random() > 0.5 ? `0-2AAA${i}` : '',
      industry: Math.random() > 0.5 ? `大数据${i}` : '',
      area: Math.random() > 0.5 ? `东京${i}` : '',
      heat: Math.round(Math.random() * 1000),
      description:
        Math.random() > 0.5
          ? '上海联展软件技术有限公司是会展互联网、信息化及营销解决方案的领先服务商' +
            '。成立于2004年，总部位于上海，在长沙、广州等设有分支或代理机构。'
          : '',
      products:
        Math.random() > 0.5
          ? Array.from({ length: 100 }, (_, i) => ({
              id: String(i),
              name: 'product1product1product1product1product1product1',
              pictures: ['./assets/images/camera.jpg']
            }))
          : [],
      visitors:
        Math.random() > 0.5
          ? Array.from({ length: 30 }, (_, i) => ({
              id: String(i),
              headImgUrl: './assets/images/camera.jpg'
            }))
          : []
      })
    }
    return results
  }
}

export interface Product {
  id?: string
  name?: string
  pictures?: string[]
  remark?: string
}

export interface Visitor {
  id?: string
  headImgUrl?: string
}

export interface RecommendExhibitorResp {
  _id?: string
  TenantId?: string
  RecordId?: string
  companyName?: string
  logo?: string
  boothArea?: string
  BoothNo?: string
  categories2?: string
  Product?: string
  province?: string
  city?: string
  ExHall?: string
  heat?: number
  ProductList?: ProductResp[]
  Visitors?: VisitorResp[]
  Organizer?: string
  OrganizerId?: string
  Industry?: string
  website?: string
  description?: string
  Introduction?: string
}

export interface ProductResp {
  Name?: string
  PicList?: PicResp[]
  Remark?: string
  UpTime?: string
}

export interface VisitorResp {
  id?: string
  HeadImgUrl?: string
}

export interface PicResp {
  PicPath?: string
}

export interface ExhibitorFilter {
  area?: string
  type?: string
  key?: string
}

export interface FetchRecommendExhibitorParams extends ExhibitorFilter {
  pageSize?: number
  pageIndex?: number
}

export interface Portray {
  id?: string
  name?: string
}

export enum ListStatus {
  EXHIBITOR,
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

export interface FilterOptions {
  label: string
  value: string
}
