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
  status?: MatcherStatus
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
      id: resp._id,
      type: resp.Type,
      status: convertMatcherStatusFromResp(resp.State),
      senderId: resp.Initator[0]._id,
      receiverId: resp.Receiver[0]._id,
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

  static extractVisitorToShow(matcher: VisitorMatcher): RecommendVisitor {
    let toShow: RecommendVisitor = null
    if (matcher.type === '0') {
      toShow = matcher.sender as RecommendVisitor
    }

    if (matcher.type === '1') {
      toShow = matcher.receiver as RecommendVisitor
    }
    return toShow
  }
}

export class VisitorMatcherResp {
  _id?: string
  Type?: string
  State?: string
  Initator?: RecommendVisitorResp[] | RecommendExhibitorResp[]
  Receiver?: RecommendVisitorResp[] | RecommendExhibitorResp[]
}

// export interface

export enum MatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  CANCEL, // 取消
  DELETED // 已删除
}

export function convertMatcherStatusFromResp(status: string): MatcherStatus {
  switch (status) {
    case '0':
      return MatcherStatus.UN_AUDIT
    case '1':
      return MatcherStatus.AUDIT_FAILED
    case '2':
      return MatcherStatus.AUDIT_SUCCESS
    case '4':
      return MatcherStatus.AGREE
    case '3':
      return MatcherStatus.REFUSE
    case '5':
      return MatcherStatus.CANCEL
    case '6':
      return MatcherStatus.DELETED

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherStatusFromModel(status: MatcherStatus): string {
  switch (status) {
    case MatcherStatus.UN_AUDIT:
      return '0'
    case MatcherStatus.AUDIT_FAILED:
      return '1'
    case MatcherStatus.AUDIT_SUCCESS:
      return '2'
    case MatcherStatus.AGREE:
      return '4'
    case MatcherStatus.REFUSE:
      return '3'
    case MatcherStatus.DELETED:
      return '6'
    case MatcherStatus.CANCEL:
      return '5'

    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherDescFromModel(
  status: MatcherStatus,
  isSender: boolean
): string {
  switch (status) {
    case MatcherStatus.UN_AUDIT:
      return '未审核'
    case MatcherStatus.AUDIT_FAILED:
      return '审核不通过'
    case MatcherStatus.AUDIT_SUCCESS:
      return '未答复'
    case MatcherStatus.AGREE:
      return '已同意'
    case MatcherStatus.REFUSE:
      return '已拒绝'
    case MatcherStatus.DELETED:
      return '已删除'
    case MatcherStatus.CANCEL:
      return '已取消'

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
