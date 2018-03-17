import {
  Exhibitor,
  ExhibitorResp,
  ExhibitorContactResp,
  Product
} from './exhibitor.model'
import { Visitor } from '../../visitor/models/visitor.model'

export class ExhibitorMatcher {
  id?: string
  status?: ExhibitorMatcherStatus
  selected?: boolean
  initatorId?: string
  receiverId?: string
  isInitator?: boolean
  isReceiver?: boolean
  initator?: Exhibitor
  receiver?: Exhibitor
  meetingStartTime: string
  meetingEndTime: string
  meetingPlace: string

  toShow?: Exhibitor

  static filterDirtyData(resp: ExhibitorMatcherResp): boolean {
    return (
      resp.Initator &&
      resp.Initator.length > 0 &&
      resp.Receiver &&
      resp.Receiver.length > 0
    )
  }

  static filterState(resp: ExhibitorMatcherResp): boolean {
    return resp.State !== '5' && resp.State !== '6'
  }

  static convertFromResp(resp: ExhibitorMatcherResp): ExhibitorMatcher {
    return {
      id: resp.RecordId,
      status: ExhibitorMatcher.convertStatusFromState(resp.State),
      initatorId: resp.Initator[0].RecordId,
      receiverId: resp.Receiver[0].RecordId,
      initator: Exhibitor.convertFromResp(resp.Initator[0]),
      receiver: Exhibitor.convertFromResp(resp.Receiver[0]),
      meetingPlace: resp.MeetingPlace,
      meetingStartTime: resp.MeetingTimeStart.trim().slice(0, 5),
      meetingEndTime: resp.MeetingTimeEnd.trim().slice(0, 5),
      selected: false
    }
  }

  static convertStatusFromState(state: string): ExhibitorMatcherStatus {
    const dest = ExhibitorInvitationStatuses.find(e => e.state === state)
    return dest ? dest.status : ExhibitorMatcherStatus.UNKNOWN
  }

  static extractExhibitorToShow(
    matcher: ExhibitorMatcher,
    currentExhibitorId: string
  ): Exhibitor {
    let toShow: Exhibitor = null
    if (matcher.initator.id === currentExhibitorId) {
      toShow = matcher.receiver
    }
    if (matcher.receiver.id === currentExhibitorId) {
      toShow = matcher.initator
    }

    if (!toShow) {
      throw new Error(
        `Current exhibitor matcher not found exhibitorId in sender or receiver; matcherId: ${
          matcher.id
        }, currentExhibitorId: ${currentExhibitorId}`
      )
    }
    return {
      id: toShow.id,
      name: toShow.name,
      logo: toShow.logo,
      boothNo: toShow.boothNo,
      industry: toShow.industry,
      area: toShow.area,
      heat: toShow.heat,
      products: toShow.products,
      visitors: toShow.visitors,
      description: toShow.description
    }
  }

  static generateFakeMatchers(start: number, end: number): ExhibitorMatcher[] {
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

export interface ExhibitorMatcherResp {
  RecordId?: string
  InitatorChild: ExhibitorContactResp[]
  Initator: ExhibitorResp[]
  ReceiverChild: ExhibitorContactResp[]
  Receiver: ExhibitorResp[]
  State: string
  Remark: string
  ApprovalTime: string
  CreatedAt: string
  MeetingTimeStart: string
  MeetingTimeEnd: string
  MeetingPlace: string
}

export enum ExhibitorMatcherDirection {
  FROM_ME = '0',
  TO_ME = '1',
  ANY = '2'
}

export enum ExhibitorMatcherStatus {
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

export const ExhibitorInvitationStatuses = [
  {
    label: '未审核',
    status: ExhibitorMatcherStatus.UN_AUDIT,
    state: '0'
  },
  {
    label: '审核未通过',
    status: ExhibitorMatcherStatus.AUDIT_FAILED,
    state: '1'
  },
  {
    label: '未答复',
    status: ExhibitorMatcherStatus.AUDIT_SUCCEED,
    state: '2'
  },
  {
    label: '已拒绝',
    status: ExhibitorMatcherStatus.REFUSE,
    state: '3'
  },
  {
    label: '已同意',
    status: ExhibitorMatcherStatus.AGREE,
    state: '4'
  },
  {
    label: '已赴约',
    status: ExhibitorMatcherStatus.KEEP_APPOINTMENT,
    state: '5'
  },
  {
    label: '已爽约',
    status: ExhibitorMatcherStatus.FAIL_KEEP_APPOINITMENT,
    state: '6'
  },
  {
    label: '已取消',
    status: ExhibitorMatcherStatus.CANCEL,
    state: '7'
  },

  {
    label: '已删除',
    status: ExhibitorMatcherStatus.DELETED,
    state: '8'
  }
]

export function convertMatcherStatusFromModel(
  status: ExhibitorMatcherStatus
): string {
  const destIndex = ExhibitorInvitationStatuses.findIndex(
    e => e.status === status
  )
  if (destIndex === -1) {
    console.warn(`Unknown exhibitor matcher status: ${status};`)
  }
  return String(destIndex)
}

export function convertMatcherDescFromModel(
  status: ExhibitorMatcherStatus,
  isSender: boolean
): string {
  const dest = ExhibitorInvitationStatuses.find(e => e.status === status)
  return dest ? dest.label : '未知状态'
}

export interface FetchMatcherParams {
  pageSize?: number
  pageIndex?: number
  statuses?: ExhibitorMatcherStatus[]
  direction?: ExhibitorMatcherDirection
}
