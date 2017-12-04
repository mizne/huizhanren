import { Action } from '@ngrx/store'
import { Recommend, ListStatus, PageStatus } from '../models/recommend.model'
import { Logger } from '../../customer/models/logger.model'

export const FETCH_RECOMMEND = '[Recommend] Fetch Recommend'
export const FETCH_RECOMMEND_SUCCESS = '[Recommend] Fetch Recommend Success'
export const FETCH_RECOMMEND_FAILURE = '[Recommend] Fetch Recommend Failure'

export const TO_INVITE_RECOMMEND = '[Recommend] To Invite Recommend'
export const CANCEL_INVITE_RECOMMEND = '[Recommend] Cancel Invite Recommend'
export const INVITE_RECOMMEND = '[Recommend] Invite Recommend'
export const INVITE_RECOMMEND_SUCCESS = '[Recommend] Invite Recommend Success'
export const INVITE_RECOMMEND_FAILURE = '[Recommend] Invite Recommend Failure'

export const CHANGE_LIST_STATUS = '[Recommend] Change List Status'
export const CHANGE_PAGE_STATUS = '[Recommend] Change Page Status'
export const TOGGLE_PAGE_STATUS = '[Recommend] Toggle Page Status'
export const UPDATE_DETAIL_ID = '[Recommend] Update Detail ID'

export const TO_CREATE_LOGGER = '[Recommend] To Create Logger'
export const CANCEL_CREATE_LOGGER = '[Recommend] Cancel Create Logger'
export const CREATE_LOGGER = '[Recommend] Create Logger'
export const CREATE_LOGGER_SUCCESS = '[Recommend] Create Logger Success'
export const CREATE_LOGGER_FAILURE = '[Recommend] Create Logger Failure'

export const FETCH_LOGGER = '[Recommend] Fetch Logger'
export const FETCH_LOGGER_SUCCESS = '[Recommend] Fetch Logger Success'
export const FETCH_LOGGER_FAILURE = '[Recommend] Fetch Logger Failure'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class FetchRecommendAction implements Action {
  readonly type = FETCH_RECOMMEND
  constructor(public payload: {
    pageSize: number,
    pageIndex: number
  } = {
    pageIndex: 1,
    pageSize: 10
  }) {}
}
export class FetchRecommendSuccessAction implements Action {
  readonly type = FETCH_RECOMMEND_SUCCESS
  constructor(public recommends: Recommend[]) {}
}
export class FetchRecommendFailureAction implements Action {
  readonly type = FETCH_RECOMMEND_FAILURE
}


export class ToInviteRecommendAction implements Action {
  readonly type = TO_INVITE_RECOMMEND
}
export class CancelInviteRecommendAction implements Action {
  readonly type = CANCEL_INVITE_RECOMMEND
}
export class InviteRecommendAction implements Action {
  readonly type = INVITE_RECOMMEND
}
export class InviteRecommendSuccessAction implements Action {
  readonly type = INVITE_RECOMMEND_SUCCESS
}
export class InviteRecommendFailureAction implements Action {
  readonly type = INVITE_RECOMMEND_FAILURE
}


export class ChangeListStatusAction implements Action {
  readonly type = CHANGE_LIST_STATUS
  constructor(public listStatus: ListStatus) {}
}
export class ChangePageStatusAction implements Action {
  readonly type = CHANGE_PAGE_STATUS
  constructor(public pageStatus: PageStatus) {}
}
export class TogglePageStatusAction implements Action {
  readonly type = TOGGLE_PAGE_STATUS
}
export class UpdateDetailIDAction implements Action {
  readonly type = UPDATE_DETAIL_ID
  constructor(public detailID: string) {}
}


export class ToCreateLoggerAction implements Action {
  readonly type = TO_CREATE_LOGGER
}
export class CancelCreateLoggerAction implements Action {
  readonly type = CANCEL_CREATE_LOGGER
}
export class CreateLoggerAction implements Action {
  readonly type = CREATE_LOGGER
  constructor(public log: Logger) {}
}
export class CreateLoggerSuccessAction implements Action {
  readonly type = CREATE_LOGGER_SUCCESS
}
export class CreateLoggerFailureAction implements Action {
  readonly type = CREATE_LOGGER_FAILURE
}


export class FetchLoggerAction implements Action {
  readonly type = FETCH_LOGGER
  constructor(public customerID: string) {}
}
export class FetchLoggerSuccessAction implements Action {
  readonly type = FETCH_LOGGER_SUCCESS
  constructor(public logs: Logger[]) {}
}
export class FetchLoggerFailureAction implements Action {
  readonly type = FETCH_LOGGER_FAILURE
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
FetchRecommendAction |
FetchRecommendSuccessAction |
FetchRecommendFailureAction |

ToInviteRecommendAction |
CancelInviteRecommendAction |
InviteRecommendAction |
InviteRecommendSuccessAction |
InviteRecommendFailureAction |

ChangeListStatusAction |
ChangePageStatusAction |
TogglePageStatusAction |
UpdateDetailIDAction |

ToCreateLoggerAction |
CancelCreateLoggerAction |
CreateLoggerAction |
CreateLoggerSuccessAction |
CreateLoggerFailureAction |

FetchLoggerAction |
FetchLoggerSuccessAction |
FetchLoggerFailureAction
