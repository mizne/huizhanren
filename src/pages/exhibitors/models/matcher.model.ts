import {
  Exhibitor,
  RecommendExhibitor,
  RecommendExhibitorResp
} from './exhibitor.model'

export class ExhibitorMatcher extends Exhibitor {
  status?: ExhibitorMatcherStatus
  senderId?: string
  receiverId?: string
  isSender?: boolean
  isReceiver?: boolean
  sender?: RecommendExhibitor
  receiver?: RecommendExhibitor

  static convertFromResp(resp: ExhibitorMatcherResp): ExhibitorMatcher {
    return {
      id: resp.RecordId || resp._id,
      status: convertMatcherStatus(resp.State),
      senderId: resp.Initator[0]._id || resp.Initator[0].RecordId,
      receiverId: resp.Receiver[0]._id || resp.Receiver[0].RecordId,
      sender: RecommendExhibitor.convertFromResp(resp.Initator[0]),
      receiver: RecommendExhibitor.convertFromResp(resp.Receiver[0]),
      selected: false
    }
  }

  static extractExhibitorToShow(
    matcher: ExhibitorMatcher,
    currentExhibitorId: string
  ): Exhibitor {
    let toShow: RecommendExhibitor = null
    if (matcher.sender.id === currentExhibitorId) {
      toShow = matcher.receiver
    }
    if (matcher.receiver.id === currentExhibitorId) {
      toShow = matcher.sender
    }

    if (!toShow) {
      throw new Error(
        `Current exhibitor matcher not found exhibitorId in sender or receiver; matcherId: ${
          matcher.id
        }, currentExhibitorId: ${currentExhibitorId}`
      )
    }
    return {
      name: toShow.name,
      logo: toShow.logo,
      booth: toShow.boothNo,
      industry: toShow.industry,
      area: toShow.area,
      heat: toShow.heat,
      products: toShow.products,
      visitors: toShow.visitors,
      description: toShow.description,
      organizer: toShow.organizer,
      organizerId: toShow.organizerId
    }
  }
}

export interface ExhibitorMatcherResp {
  RecordId?: string
  _id?: string
  State?: string
  Initator?: RecommendExhibitorResp[]
  Receiver?: RecommendExhibitorResp[]
}

export enum ExhibitorMatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  DELETED, // 已删除
  CANCEL // 已取消
}

function convertMatcherStatus(status: string): ExhibitorMatcherStatus {
  switch (status) {
    case '0':
      return ExhibitorMatcherStatus.UN_AUDIT
    case '1':
      return ExhibitorMatcherStatus.AUDIT_FAILED
    case '2':
      return ExhibitorMatcherStatus.AUDIT_SUCCESS
    case '4':
      return ExhibitorMatcherStatus.AGREE
    case '3':
      return ExhibitorMatcherStatus.REFUSE
    case '6':
      return ExhibitorMatcherStatus.DELETED
    case '5':
      return ExhibitorMatcherStatus.CANCEL

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
      return '0'
    case ExhibitorMatcherStatus.AUDIT_FAILED:
      return '1'
    case ExhibitorMatcherStatus.AUDIT_SUCCESS:
      return '2'
    case ExhibitorMatcherStatus.AGREE:
      return '4'
    case ExhibitorMatcherStatus.REFUSE:
      return '3'
    case ExhibitorMatcherStatus.DELETED:
      return '6'
    case ExhibitorMatcherStatus.CANCEL:
      return '5'
    default:
      console.warn(`Unknown matcher status: ${status}`)
      break
  }
}

export function convertMatcherDescFromModel(
  status: ExhibitorMatcherStatus,
  isSender: boolean
): string {
  switch (status) {
    case ExhibitorMatcherStatus.UN_AUDIT:
      return '未审核'
    case ExhibitorMatcherStatus.AUDIT_FAILED:
      return '审核不通过'
    case ExhibitorMatcherStatus.AUDIT_SUCCESS:
      return '未答复'
    case ExhibitorMatcherStatus.AGREE:
      return '已同意'
    case ExhibitorMatcherStatus.REFUSE:
      return '已拒绝'
    case ExhibitorMatcherStatus.DELETED:
      return '已删除'
    case ExhibitorMatcherStatus.CANCEL:
      return '已取消'

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
