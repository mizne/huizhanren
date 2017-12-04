import { Customer } from './recommend.model'

export class Matcher extends Customer {
  status?: MatcherStatus
  selected?: boolean

  static convertFromResp(resp: MatcherResp): Matcher {
    return {
      id: resp._id,
      name: resp.Name,
      title: resp.JobTitle,
      company: resp.CompName,
      industry: resp.Industry,
      area: resp.Province,
      organizer: resp.Organizer,
      organizerId: resp.OrganizerId,
      mobile: resp.Mob,
      status: convertMatcherStatusFromResp(resp.State)
    }
  }
}

export class MatcherResp {
  _id?: string
  Organizer?: string
  OrganizerId?: string
  Name?: string
  CompName?: string
  Mob?: string
  JobTitle?: string
  Province?: string
  State?: string
  Industry?: string
}

// export interface

export enum MatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  DELETED // 已删除
}

export function convertMatcherStatusFromResp(status: string): MatcherStatus {
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

export function convertMatcherStatusFromModel(status: MatcherStatus): string {
  switch (status) {
    case MatcherStatus.UN_AUDIT:
      return '未审核'
    case MatcherStatus.AUDIT_FAILED:
      return '审核未通过'
    case MatcherStatus.AUDIT_SUCCESS:
      return '未答复'
    case MatcherStatus.AGREE:
      return '已同意'
    case MatcherStatus.REFUSE:
      return '已拒绝'
    case MatcherStatus.DELETED:
      return '已删除'

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export interface FetchMatcherParams {
  pageSize?: number
  pageIndex?: number
  statuses?: MatcherStatus[]
}
