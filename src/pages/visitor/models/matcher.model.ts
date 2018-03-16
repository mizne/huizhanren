import { Visitor, VisitorResp } from './visitor.model'
import {
  Exhibitor,
  ExhibitorResp,
  ExhibitorContactResp
} from '../../exhibitors/models/exhibitor.model'

export class VisitorMatcher {
  id: string
  status?: VisitorMatcherStatus
  selected?: boolean
  initatorId?: string
  receiverId?: string
  type?: VisitorMatcherType
  isInitator?: boolean
  isReceiver?: boolean
  initator?: Visitor | Exhibitor
  receiver?: Visitor | Exhibitor
  meetingStartTime: string
  meetingEndTime: string
  meetingPlace: string

  toShow?: Visitor

  static extractInitatorAndReceiver(
    resp: VisitorMatcherResp,
    type: VisitorMatcherType
  ): {
    initator: Visitor | Exhibitor
    receiver: Visitor | Exhibitor
  } {
    switch (type) {
      case VisitorMatcherType.VISITOR_TO_EXHIBITOR:
        return {
          initator: Visitor.convertFromResp(resp.VisitorInitator[0]),
          receiver: Exhibitor.convertFromResp(resp.Receiver[0])
        }
      case VisitorMatcherType.EXHIBITOR_TO_VISITOR:
        return {
          initator: Exhibitor.convertFromResp(resp.Initator[0]),
          receiver: Visitor.convertFromResp(resp.VisitorReceiver[0])
        }
      default:
        console.warn(`Unknown visitor matcher type: ${type}`)
    }
  }

  static convertStatusFromState(state: string): VisitorMatcherStatus {
    const dest = VisitorInvitationStatuses.find(e => e.status === state)
    return dest ? dest.status : VisitorMatcherStatus.UNKNOWN
  }

  static convertTypeFromResp(type: string): VisitorMatcherType {
    return type === '0'
      ? VisitorMatcherType.VISITOR_TO_EXHIBITOR
      : type === '1'
        ? VisitorMatcherType.EXHIBITOR_TO_VISITOR
        : (console.warn(`Unknown visitor matcher type: ${type}`),
          VisitorMatcherType.UNKNOWN)
  }

  static convertFromResp(resp: VisitorMatcherResp): VisitorMatcher {
    const type = VisitorMatcher.convertTypeFromResp(resp.Type)
    const status = VisitorMatcher.convertStatusFromState(resp.State)
    const { initator, receiver } = VisitorMatcher.extractInitatorAndReceiver(
      resp,
      type
    )
    return {
      id: resp.RecordId,
      type,
      status,
      initatorId: initator.id,
      receiverId: receiver.id,
      initator,
      receiver,
      meetingPlace: resp.MeetingPlace,
      meetingStartTime: resp.MeetingTimeStart.trim().slice(0, 5),
      meetingEndTime: resp.MeetingTimeEnd.trim().slice(0, 5)
    }
  }

  static extractVisitorToShow(
    matcher: VisitorMatcher,
    exhibitorId: string
  ): Visitor {
    let toShow: Visitor = null
    if (
      matcher.initator.id !== exhibitorId &&
      matcher.receiver.id !== exhibitorId
    ) {
      throw new Error(
        `Matcher not belong to exhibitor; matcherId: ${
          matcher.id
        }, exhibitorId: ${exhibitorId}`
      )
    }

    toShow =
      matcher.type === VisitorMatcherType.VISITOR_TO_EXHIBITOR
        ? matcher.initator
        : matcher.receiver

    return {
      name: toShow.name,
      title: toShow.title,
      company: toShow.company,
      industry: toShow.industry,
      area: toShow.area,
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
        status: i % 5
      })
    }
    return results
  }
}

export class VisitorMatcherResp {
  RecordId?: string
  Type?: string
  State?: string
  MeetingTimeStart: string
  MeetingTimeEnd: string
  MeetingPlace: string
  // Type为1 展商发起约请
  Initator: ExhibitorResp[] // 发送方展商
  InitatorChild: ExhibitorContactResp[] // 发送方展商联系人
  VisitorReceiver: VisitorResp[] // 接收方买家

  // Type为0 买家发起约请
  Receiver: ExhibitorResp[] // 接收方展商
  VisitorInitator: VisitorResp[] // 发送方买家
  ReceiverChild: ExhibitorContactResp[] // 接收方展商联系人
}

export enum VisitorMatcherType {
  VISITOR_TO_EXHIBITOR = '0',
  EXHIBITOR_TO_VISITOR = '1',
  UNKNOWN = 'Unknown'
}

export enum VisitorMatcherDirection {
  FROM_ME = '0',
  TO_ME = '1',
  ANY = '2'
}

export enum VisitorMatcherStatus {
  UNKNOWN = '9', // 未知状态
  UN_AUDIT = '0', // 未审核
  AUDIT_FAILED = '1', // 审核未通过
  AUDIT_SUCCEED = '2', // 审核通过 未答复
  AGREE = '4', // 同意
  REFUSE = '3', // 拒绝
  DELETED = '8', // 已删除
  CANCEL = '7', // 已取消
  KEEP_APPOINTMENT = '5', // 已赴约
  FAIL_KEEP_APPOINITMENT = '6', // 已爽约
  ANY = '10' // 任意状态
}

export const VisitorInvitationStatuses = [
  {
    label: '未审核',
    status: VisitorMatcherStatus.UN_AUDIT
  },
  {
    label: '审核未通过',
    status: VisitorMatcherStatus.AUDIT_FAILED
  },
  {
    label: '未答复',
    status: VisitorMatcherStatus.AUDIT_SUCCEED
  },
  {
    label: '已拒绝',
    status: VisitorMatcherStatus.REFUSE
  },
  {
    label: '已同意',
    status: VisitorMatcherStatus.AGREE
  },
  {
    label: '已赴约',
    status: VisitorMatcherStatus.KEEP_APPOINTMENT
  },
  {
    label: '已爽约',
    status: VisitorMatcherStatus.FAIL_KEEP_APPOINITMENT
  },
  {
    label: '已取消',
    status: VisitorMatcherStatus.CANCEL
  },

  {
    label: '已删除',
    status: VisitorMatcherStatus.DELETED
  }
]

export function convertMatcherStatusFromModel(
  status: VisitorMatcherStatus
): string {
  const destIndex = VisitorInvitationStatuses.findIndex(
    e => e.status === status
  )
  if (destIndex === -1) {
    console.warn(`Unknown visitor matcher status: ${status};`)
  }
  return String(destIndex)
}

export function convertMatcherDescFromModel(
  status: VisitorMatcherStatus,
  isSender: boolean
): string {
  const dest = VisitorInvitationStatuses.find(e => e.status === status)
  return dest ? dest.label : '未知状态'
}

export interface FetchMatcherParams {
  pageSize?: number
  pageIndex?: number
  statuses?: VisitorMatcherStatus[]
  direction?: VisitorMatcherDirection
}
