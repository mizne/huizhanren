import {
  Exhibitor,
  RecommendExhibitor,
  RecommendExhibitorResp
} from './exhibitor.model'

export class ExhibitorMatcher extends Exhibitor {
  status?: ExhibitorMatcherStatus
  selected?: boolean
  senderId?: string
  receiverId?: string
  isSender?: boolean
  isReceiver?: boolean
  sender?: RecommendExhibitor
  receiver?: RecommendExhibitor

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
      id: resp.RecordId || resp._id,
      status: convertMatcherStatusFromResp(resp.State),
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

function convertMatcherStatusFromResp(status: string): ExhibitorMatcherStatus {
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
