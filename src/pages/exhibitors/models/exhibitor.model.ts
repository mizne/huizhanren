export class Exhibitor {
  id?: string
  name?: string
  logo?: string
  booth?: string
  industry?: string
  area?: string
  heat?: number
  active?: boolean
  products?: Product[]
  description?: string

  static convertFromResp(resp: ExhibitorResp): Exhibitor {
    return {
      id: resp._id,
      name: resp.companyName,
      logo: resp.logo,
      booth: resp.boothArea,
      industry: resp.categories2,
      area: resp.province,
      heat: resp.heat,
      active: resp.active,
      products: resp.ProductList.map(e => ({
        id: e.Name,
        name: e.Name,
        pictures: e.PicList.map(f => f.PicPath)
      })),
      description: resp.website
    }
  }
}

export interface Product {
  id?: string
  name?: string
  pictures?: string[]
}

export interface ExhibitorResp {
  _id?: string
  companyName?: string
  logo?: string
  boothArea?: string
  categories2?: string
  Product?: string
  province?: string
  heat?: number
  ProductList?: ProductResp[]
  website?: string
  active?: boolean
}

export interface ProductResp {
  Name?: string
  PicList?: PicResp[]
  Remark?: string
  UpTime?: string
}

export interface PicResp {
  PicPath?: string
}

export interface ExhibitorFilter {
  area: string,
  acreage: string,
  key: string
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
  BATCH_DELETE
}
