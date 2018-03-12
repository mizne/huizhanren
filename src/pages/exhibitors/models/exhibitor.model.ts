import { VisitorResp, Visitor　}　from '../../visitor/models/visitor.model'

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
  selected?: boolean

  static convertFromResp(resp: ExhibitorResp): Exhibitor {
    return {
      id: resp.RecordId,
      name: resp.CompanyName,
      logo: resp.Logo || './assets/images/default_exhibitor.png',
      booth: resp.BoothArea,
      boothNo: resp.BoothNo,
      exHall: resp.ExHall,
      industry: resp.Industry,
      area: resp.Province,
      city: resp.City,
      heat: resp.Heat || Math.round(Math.random() * 1000),
      products: resp.ProductList.map(Product.convertFromResp),
      visitors: resp.Visitors.map(Visitor.convertFromResp),
      description: resp.Introduction,
      website: resp.Website,
      selected: false
    }
  }

  static generateFakeExhibitors(
    start: number,
    end: number
  ): Exhibitor[] {
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

export interface ExhibitorContactResp {
  Name: string
  CompanyName: string
  Job: string
}

export interface ExhibitorResp {
    RecordId?: string
    CompanyName: string
    Addr: string
    Email: string
    Fax: string
    Tel: string
    Website: string
    Logo: string

    Country: string
    Province: string
    City: string

    Industry: string
    Categories: string
    Categories2: string

    BoothArea: string
    BoothNo: string
    ExHall: string
    ShowArea: string
    Introduction: string
    Heat: number

    LinkList: LinkResp[]
    ProductList: ProductResp[]
    Visitors: VisitorResp[]
}


export class Link {
  isAdmin: boolean
  name: string
  job: string
  phone: string

  static convertFromResp(resp: LinkResp): Link {
      return {
          isAdmin: resp.admin === 0,
          name: resp.LinkName,
          job: resp.Job,
          phone: resp.LinkMob
      }
  }
}

export interface LinkResp {
  Job: string
  LinkMob: string
  LinkName: string
  admin: number
}

export class Product {
  name: string
  remark: string
  picList: Pic[]

  static convertFromResp(resp: ProductResp): Product {
      return {
          name: resp.Name,
          remark: resp.Remark,
          picList: resp.PicList.map(Pic.convertFromResp)
      }
  }
}

export interface ProductResp {
  Name: string
  Remark: string
  PicList: PicResp[]
}

export class Pic {
  path: string
  static convertFromResp(resp: PicResp): Pic {
      return {
          path: resp.PicPath
      }
  }
}

export interface PicResp {
  PicPath: string
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
