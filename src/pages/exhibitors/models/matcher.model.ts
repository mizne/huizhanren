import { Exhibitor } from './exhibitor.model'

export class ExhibitorMatcher extends Exhibitor {
  status?: ExhibitorMatcherStatus
  senderId?: string
  receiverId?: string
  isSender?: boolean
  isReceiver?: boolean

  static convertFromResp(resp: ExhibitorMatcherResp): ExhibitorMatcher {
    return {
      id: resp._id,
      name: resp.companyName,
      logo: resp.logo,
      booth: resp.BoothNo,
      industry: resp.Industry,
      area: resp.city,
      heat: resp.heat,
      status: convertMatcherStatus(resp.State),
      senderId: resp.Initator,
      receiverId: resp.Receiver,
      products: [],
      description: resp.website,
      organizer: resp.Organizer,
      organizerId: resp.OrganizerId,
      selected: false
    }
  }
}

export interface ExhibitorMatcherResp {
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
  Industry?: string
  heat?: number
  Initator?: string
  Receiver?: string
  website?: string
}

export enum ExhibitorMatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  DELETED // 已删除
}

function convertMatcherStatus(status: string): ExhibitorMatcherStatus {
  switch (status) {
    case '未审核':
      return ExhibitorMatcherStatus.UN_AUDIT
    case '审核未通过':
      return ExhibitorMatcherStatus.AUDIT_FAILED
    case '未答复':
      return ExhibitorMatcherStatus.AUDIT_SUCCESS
    case '已同意':
      return ExhibitorMatcherStatus.AGREE
    case '已拒绝':
      return ExhibitorMatcherStatus.REFUSE
    case '已删除':
      return ExhibitorMatcherStatus.DELETED

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherStatusFromModel(
  status: ExhibitorMatcherStatus
): string {
  switch (status) {
    case ExhibitorMatcherStatus.UN_AUDIT:
      return '未审核'
    case ExhibitorMatcherStatus.AUDIT_FAILED:
      return '审核未通过'
    case ExhibitorMatcherStatus.AUDIT_SUCCESS:
      return '未答复'
    case ExhibitorMatcherStatus.AGREE:
      return '已同意'
    case ExhibitorMatcherStatus.REFUSE:
      return '已拒绝'
    case ExhibitorMatcherStatus.DELETED:
      return '已删除'

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export interface FetchMatcherParams {
  pageSize?: number
  pageIndex?: number
  statuses?: ExhibitorMatcherStatus[]
}
