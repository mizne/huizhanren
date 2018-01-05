import {
  Visitor,
  RecommendVisitor,
  RecommendVisitorResp
} from './visitor.model'
import {
  RecommendExhibitor,
  RecommendExhibitorResp
} from '../../exhibitors/models/exhibitor.model'

export class VisitorMatcher extends Visitor {
  status?: VisitorMatcherStatus
  selected?: boolean
  senderId?: string
  receiverId?: string
  type?: string
  isSender?: boolean
  isReceiver?: boolean
  sender?: RecommendVisitor | RecommendExhibitor
  receiver?: RecommendVisitor | RecommendExhibitor

  static convertFromResp(resp: VisitorMatcherResp): VisitorMatcher {
    return {
      id: resp.RecordId || resp._id,
      type: resp.Type,
      status: convertMatcherStatusFromResp(resp.State),
      senderId: resp.Initator[0].RecordId || resp.Initator[0]._id,
      receiverId: resp.Receiver[0].RecordId || resp.Receiver[0]._id,
      sender: (() => {
        if (resp.Type === '0') {
          return RecommendVisitor.convertFromResp(resp.Initator[0])
        }
        if (resp.Type === '1') {
          return RecommendExhibitor.convertFromResp(resp.Initator[0])
        }
      })(),
      receiver: (() => {
        if (resp.Type === '0') {
          return RecommendExhibitor.convertFromResp(resp.Receiver[0])
        }
        if (resp.Type === '1') {
          return RecommendVisitor.convertFromResp(resp.Receiver[0])
        }
      })()
    }
  }

  static extractVisitorToShow(
    matcher: VisitorMatcher,
    exhibitorId: string
  ): RecommendVisitor {
    let toShow: RecommendVisitor = null
    if (
      matcher.sender.id !== exhibitorId &&
      matcher.receiver.id !== exhibitorId
    ) {
      throw new Error(
        `Matcher not belong to exhibitor; matcherId: ${
          matcher.id
        }, exhibitorId: ${exhibitorId}`
      )
    }
    if (matcher.type === '0') {
      toShow = matcher.sender as RecommendVisitor
    }

    if (matcher.type === '1') {
      toShow = matcher.receiver as RecommendVisitor
    }
    return {
      name: toShow.name,
      title: toShow.title,
      company: toShow.company,
      industry: toShow.industry,
      area: toShow.area,
      organizer: toShow.organizer,
      mobile: toShow.mobile,
      cardImg: toShow.cardImg,
      email: toShow.email
    }
  }

  static generateFakeMatchers(start: number, end: number): VisitorMatcher[] {
    const results = []
    for (let i = start; i < end; i += 1) {
      results.push({
        id: 'matcher-' + String(i),
        name: `李${i}`,
        title: `经理${i}`,
        company: `移动公司${i}`,
        industry: `互联网${i}`,
        area: `北京${i}`,
        status: i % 5,
      })
    }
    return results
  }
}

export class VisitorMatcherResp {
  _id?: string
  RecordId?: string
  Type?: string
  State?: string
  Initator?: RecommendVisitorResp[] | RecommendExhibitorResp[]
  Receiver?: RecommendVisitorResp[] | RecommendExhibitorResp[]
}

// export interface

export enum VisitorMatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  CANCEL, // 取消
  DELETED // 已删除
}

export function convertMatcherStatusFromResp(
  status: string
): VisitorMatcherStatus {
  switch (status) {
    case '0':
      return VisitorMatcherStatus.UN_AUDIT
    case '1':
      return VisitorMatcherStatus.AUDIT_FAILED
    case '2':
      return VisitorMatcherStatus.AUDIT_SUCCESS
    case '4':
      return VisitorMatcherStatus.AGREE
    case '3':
      return VisitorMatcherStatus.REFUSE
    case '5':
      return VisitorMatcherStatus.CANCEL
    case '6':
      return VisitorMatcherStatus.DELETED

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherStatusFromModel(
  status: VisitorMatcherStatus
): string {
  switch (status) {
    case VisitorMatcherStatus.UN_AUDIT:
      return '0'
    case VisitorMatcherStatus.AUDIT_FAILED:
      return '1'
    case VisitorMatcherStatus.AUDIT_SUCCESS:
      return '2'
    case VisitorMatcherStatus.AGREE:
      return '4'
    case VisitorMatcherStatus.REFUSE:
      return '3'
    case VisitorMatcherStatus.DELETED:
      return '6'
    case VisitorMatcherStatus.CANCEL:
      return '5'

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherDescFromModel(
  status: VisitorMatcherStatus,
  isSender: boolean
): string {
  switch (status) {
    case VisitorMatcherStatus.UN_AUDIT:
      return '未审核'
    case VisitorMatcherStatus.AUDIT_FAILED:
      return '审核不通过'
    case VisitorMatcherStatus.AUDIT_SUCCESS:
      return '未答复'
    case VisitorMatcherStatus.AGREE:
      return '已同意'
    case VisitorMatcherStatus.REFUSE:
      return '已拒绝'
    case VisitorMatcherStatus.DELETED:
      return '已删除'
    case VisitorMatcherStatus.CANCEL:
      return '已取消'

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export interface FetchMatcherParams {
  pageSize?: number
  pageIndex?: number
  statuses?: VisitorMatcherStatus[]
}
