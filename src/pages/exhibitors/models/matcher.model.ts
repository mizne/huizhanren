import { Exhibitor } from './exhibitor.model'

export class Matcher extends Exhibitor {
  status?: MatcherStatus
}

export enum MatcherStatus {
  UN_AUDIT, // 未审核
  AUDIT_FAILED, // 审核未通过
  AUDIT_SUCCESS, // 审核通过 未答复
  AGREE, // 同意
  REFUSE, // 拒绝
  DELETED // 已删除
}