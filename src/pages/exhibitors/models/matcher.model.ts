import { Exhibitor } from './exhibitor.model'

export class Matcher extends Exhibitor {
  status?: MatcherStatus

  static convertFromResp(resp: MatcherResp): Matcher {
    return {
      id: resp._id,
      name: resp.companyName,
      logo: resp.logo,
      booth: resp.BoothNo,
      industry: resp.industry,
      area: resp.city,
      heat: resp.heat
    }
  }
}

export interface MatcherResp {
  _id?: string
  Organizer?: string
  OrganizerId?: string
  companyName?: string
  city?: string
  boothArea?: string
  ExHall?: string
  BoothNo?: string
  State?: string
  logo?: string
  industry?: string
  heat?: number
}

export enum MatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  DELETED // 已删除
}

function convertMatcherStatus(status: string): MatcherStatus {
  switch (status) {
    case '未审核':
      return MatcherStatus.UN_AUDIT
    case '审核未通过':
      return MatcherStatus.AUDIT_FAILED
    case '未答复':
      return MatcherStatus.AUDIT_SUCCESS
    case '已同意':
      return MatcherStatus.AGREE
    case '已拒绝':
      return MatcherStatus.REFUSE
    case '已删除':
      return MatcherStatus.DELETED

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}
