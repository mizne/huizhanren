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
  organizer?: string
  organizerId?: string
  selected?: boolean
}

export class RecommendExhibitor extends Exhibitor {
  static convertFromResp(resp: RecommendExhibitorResp): RecommendExhibitor {
    return {
      id: resp.TenantId,
      name: resp.companyName,
      logo: resp.logo,
      booth: resp.boothArea,
      boothNo: resp.BoothNo,
      exHall: resp.ExHall,
      industry: resp.categories2,
      area: resp.province,
      city: resp.city,
      heat: resp.heat || Math.round(Math.random() * 1000),
      products: resp.ProductList.map(e => ({
        id: e.Name,
        name: e.Name,
        remark: e.Remark,
        pictures: e.PicList.map(f => f.PicPath)
      })),
      description: resp.website,
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
}

export interface Product {
  id?: string
  name?: string
  pictures?: string[]
  remark?: string
}

export interface RecommendExhibitorResp {
  TenantId?: string
  _id?: string
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
  Organizer?: string
  OrganizerId?: string
  website?: string
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
  area: string
  acreage: string
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
