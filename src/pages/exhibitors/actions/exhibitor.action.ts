import { Action } from '@ngrx/store'
import { Exhibitor, ListStatus, PageStatus, Product, FetchRecommendExhibitorParams, ExhibitorFilter } from '../models/exhibitor.model'
import { Logger } from '../../customer/models/logger.model'

export const FETCH_EXHIBITORS = '[Exhibitor] Fetch Exhibitors'
export const FETCH_EXHIBITORS_SUCCESS = '[Exhibitor] Fetch Exhibitors Success'
export const FETCH_EXHIBITORS_FAILURE = '[Exhibitor] Fetch Exhibitors Failure'

export const FETCH_EXHIBITORS_COUNT = '[Exhibitor] Fetch Exhibitors Count'
export const FETCH_EXHIBITORS_COUNT_SUCCESS = '[Exhibitor] Fetch Exhibitors Count Success'
export const FETCH_EXHIBITORS_COUNT_FAILURE = '[Exhibitor] Fetch Exhibitors Count Failure'

export const LOAD_MORE_EXHIBITORS = '[Exhibitor] Load More Exhibitors'
export const LOAD_MORE_EXHIBITORS_SUCCESS = '[Exhibitor] Load More Exhibitors Success'
export const LOAD_MORE_EXHIBITORS_FAILURE = '[Exhibitor] Load More Exhibitors Failure'

export const TO_INVITE_EXHIBITOR = '[Exhibitor] To Invite Exhibitor'
export const CANCEL_INVITE_EXHIBITOR = '[Exhibitor] Cancel Invite Exhibitor'
export const INVITE_EXHIBITOR = '[Exhibitor] Invite Exhibitor'
export const INVITE_EXHIBITOR_SUCCESS = '[Exhibitor] Invite Exhibitor Success'
export const INVITE_EXHIBITOR_FAILURE = '[Exhibitor] Invite Exhibitor Failure'

export const CHANGE_LIST_STATUS = '[Exhibitor] Change List Status'
export const CHANGE_PAGE_STATUS = '[Exhibitor] Change Page Status'
export const TOGGLE_PAGE_STATUS = '[Exhibitor] Toggle Page Status'
export const UPDATE_DETAIL_ID = '[Exhibitor] Update Detail ID'

export const TO_CREATE_LOGGER = '[Exhibitor] To Create Logger'
export const CANCEL_CREATE_LOGGER = '[Exhibitor] Cancel Create Logger'
export const CREATE_LOGGER = '[Exhibitor] Create Logger'
export const CREATE_LOGGER_SUCCESS = '[Exhibitor] Create Logger Success'
export const CREATE_LOGGER_FAILURE = '[Exhibitor] Create Logger Failure'

export const FETCH_LOGGER = '[Exhibitor] Fetch Logger'
export const FETCH_LOGGER_SUCCESS = '[Exhibitor] Fetch Logger Success'
export const FETCH_LOGGER_FAILURE = '[Exhibitor] Fetch Logger Failure'

export const TO_SHOW_PRODUCT = '[Exhibitor] To Show Product'
export const CANCEL_SHOW_PRODUCT = '[Exhibitor] Cancel Show Product'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class FetchExhibitorsAction implements Action {
  readonly type = FETCH_EXHIBITORS
  constructor(public params: FetchRecommendExhibitorParams = {
    pageIndex: 1,
    pageSize: 10
  }) {}
}
export class FetchExhibitorsSuccessAction implements Action {
  readonly type = FETCH_EXHIBITORS_SUCCESS
  constructor(public exhibitors: Exhibitor[]) {}
}
export class FetchExhibitorsFailureAction implements Action {
  readonly type = FETCH_EXHIBITORS_FAILURE
}


export class FetchExhibitorsCountAction implements Action {
  readonly type = FETCH_EXHIBITORS_COUNT
  constructor(public params: ExhibitorFilter = {
    acreage: '',
    area: '',
    key: ''
  }) {}
}
export class FetchExhibitorsCountSuccessAction implements Action {
  readonly type = FETCH_EXHIBITORS_COUNT_SUCCESS
  constructor(public count: number) {}
}
export class FetchExhibitorsCountFailureAction implements Action {
  readonly type = FETCH_EXHIBITORS_COUNT_FAILURE
}


export class LoadMoreExhibitorsAction implements Action {
  readonly type = LOAD_MORE_EXHIBITORS
  constructor(public params: FetchRecommendExhibitorParams) {}
}
export class LoadMoreExhibitorsSuccessAction implements Action {
  readonly type = LOAD_MORE_EXHIBITORS_SUCCESS
  constructor(public exhibitors: Exhibitor[]) {}
}
export class LoadMoreExhibitorsFailureAction implements Action {
  readonly type = LOAD_MORE_EXHIBITORS_FAILURE
}


export class ToInviteExhibitorAction implements Action {
  readonly type = TO_INVITE_EXHIBITOR
}
export class CancelInviteExhibitorAction implements Action {
  readonly type = CANCEL_INVITE_EXHIBITOR
}
export class InviteExhibitorAction implements Action {
  readonly type = INVITE_EXHIBITOR
  constructor(public boothNo: string) {}
}
export class InviteExhibitorSuccessAction implements Action {
  readonly type = INVITE_EXHIBITOR_SUCCESS
}
export class InviteExhibitorFailureAction implements Action {
  readonly type = INVITE_EXHIBITOR_FAILURE
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
  constructor(public exhibitionID: string) {}
}
export class FetchLoggerSuccessAction implements Action {
  readonly type = FETCH_LOGGER_SUCCESS
  constructor(public logs: Logger[]) {}
}
export class FetchLoggerFailureAction implements Action {
  readonly type = FETCH_LOGGER_FAILURE
}


export class ToShowProcuctAction implements Action {
  readonly type = TO_SHOW_PRODUCT
  constructor(public product: Product)　{}
}
export class CancelShowProductAction implements Action {
  readonly type = CANCEL_SHOW_PRODUCT
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
FetchExhibitorsAction |
FetchExhibitorsSuccessAction |
FetchExhibitorsFailureAction |

FetchExhibitorsCountAction |
FetchExhibitorsCountSuccessAction |
FetchExhibitorsCountFailureAction |

LoadMoreExhibitorsAction |
LoadMoreExhibitorsSuccessAction |
LoadMoreExhibitorsFailureAction |

ToInviteExhibitorAction |
CancelInviteExhibitorAction |
InviteExhibitorAction |
InviteExhibitorSuccessAction |
InviteExhibitorFailureAction |

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
FetchLoggerFailureAction |

ToShowProcuctAction |
CancelShowProductAction
