import { Action } from '@ngrx/store'
import {
  Visitor,
  ListStatus,
  PageStatus,
  FetchVisitorParams,
  VisitorFilter,
  FilterOptions
} from '../models/visitor.model'
import { VisitorLogger, VisitorLoggerLevel } from '../models/visitor-logger.model'

export const FETCH_VISITORS = '[Visitor] Fetch Visitors'
export const FETCH_VISITORS_SUCCESS = '[Visitor] Fetch Visitors Success'
export const FETCH_VISITORS_FAILURE = '[Visitor] Fetch Visitors Failure'

export const FETCH_VISITORS_COUNT = '[Visitor] Fetch Visitors Count'
export const FETCH_VISITORS_COUNT_SUCCESS =
  '[Visitor] Fetch Visitors Count Success'
export const FETCH_VISITORS_COUNT_FAILURE =
  '[Visitor] Fetch Visitors Count Failure'

export const FETCH_AREA_FILTER_OPTIONS = '[Visitor] Fetch Area Filter Options'
export const FETCH_AREA_FILTER_OPTIONS_SUCCESS =
  '[Visitor] Fetch Area Filter Options Success'
export const FETCH_AREA_FILTER_OPTIONS_FAILURE =
  '[Visitor] Fetch Area Filter Options Failure'

export const FETCH_TYPE_FILTER_OPTIONS = '[Visitor] Fetch Type Filter Options'
export const FETCH_TYPE_FILTER_OPTIONS_SUCCESS =
  '[Visitor] Fetch Type Filter Options Success'
export const FETCH_TYPE_FILTER_OPTIONS_FAILURE =
  '[Visitor] Fetch Type Filter Options Failure'

export const LOAD_MORE_VISITORS = '[Visitor] Load More Visitors'
export const LOAD_MORE_VISITORS_SUCCESS = '[Visitor] Load More Visitors Success'
export const LOAD_MORE_VISITORS_FAILURE = '[Visitor] Load More Visitors Failure'

export const TO_INVITE_VISITOR = '[Visitor] To Invite Visitor'
export const CANCEL_INVITE_VISITOR = '[Visitor] Cancel Invite Visitor'
export const INVITE_VISITOR = '[Visitor] Invite Visitor'
export const INVITE_VISITOR_SUCCESS = '[Visitor] Invite Visitor Success'
export const INVITE_VISITOR_FAILURE = '[Visitor] Invite Visitor Failure'

export const TO_INIVITE_VISITOR_TO_MICRO_APP =
  '[Visitor] To Invite Visitor To Micro App'

export const CHANGE_LIST_STATUS = '[Visitor] Change List Status'
export const CHANGE_PAGE_STATUS = '[Visitor] Change Page Status'
export const TOGGLE_PAGE_STATUS = '[Visitor] Toggle Page Status'
export const UPDATE_VISITOR_DETAIL_ID = '[Visitor] Update Visitor Detail ID'

export const TO_CREATE_LOGGER = '[Visitor] To Create Logger'
export const CANCEL_CREATE_LOGGER = '[Visitor] Cancel Create Logger'
export const CREATE_LOGGER = '[Visitor] Create Logger'
export const CREATE_LOGGER_SUCCESS = '[Visitor] Create Logger Success'
export const CREATE_LOGGER_FAILURE = '[Visitor] Create Logger Failure'

export const FETCH_LOGGER = '[Visitor] Fetch Logger'
export const FETCH_LOGGER_SUCCESS = '[Visitor] Fetch Logger Success'
export const FETCH_LOGGER_FAILURE = '[Visitor] Fetch Logger Failure'

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class FetchVisitorsAction implements Action {
  readonly type = FETCH_VISITORS
  constructor(
    public params: FetchVisitorParams
  ) {}
}
export class FetchVisitorsSuccessAction implements Action {
  readonly type = FETCH_VISITORS_SUCCESS
  constructor(public visitors: Visitor[]) {}
}
export class FetchVisitorsFailureAction implements Action {
  readonly type = FETCH_VISITORS_FAILURE
}

export class FetchVisitorsCountAction implements Action {
  readonly type = FETCH_VISITORS_COUNT
  constructor(
    public params: VisitorFilter = {
      key: '',
      area: '',
      type: ''
    }
  ) {}
}
export class FetchVisitorsCountSuccessAction implements Action {
  readonly type = FETCH_VISITORS_COUNT_SUCCESS
  constructor(public count: number) {}
}
export class FetchVisitorsCountFailureAction implements Action {
  readonly type = FETCH_VISITORS_COUNT_FAILURE
}

export class FetchAreaFilterOptionsAction implements Action {
  readonly type = FETCH_AREA_FILTER_OPTIONS
}
export class FetchAreaFilterOptionsSuccessAction implements Action {
  readonly type = FETCH_AREA_FILTER_OPTIONS_SUCCESS
  constructor(public areaFilters: FilterOptions[]) {}
}
export class FetchAreaFilterOptionsFailureAction implements Action {
  readonly type = FETCH_AREA_FILTER_OPTIONS_FAILURE
}

export class FetchTypeFilterOptionsAction implements Action {
  readonly type = FETCH_TYPE_FILTER_OPTIONS
}
export class FetchTypeFilterOptionsSuccessAction implements Action {
  readonly type = FETCH_TYPE_FILTER_OPTIONS_SUCCESS
  constructor(public typeFilters: FilterOptions[]) {}
}
export class FetchTypeFilterOptionsFailureAction implements Action {
  readonly type = FETCH_TYPE_FILTER_OPTIONS_FAILURE
}

export class LoadMoreVisitorsAction implements Action {
  readonly type = LOAD_MORE_VISITORS
  constructor(public params: FetchVisitorParams) {}
}
export class LoadMoreVisitorsSuccessAction implements Action {
  readonly type = LOAD_MORE_VISITORS_SUCCESS
  constructor(public visitors: Visitor[]) {}
}
export class LoadMoreVisitorsFailureAction implements Action {
  readonly type = LOAD_MORE_VISITORS_FAILURE
}

export class ToInviteVisitorAction implements Action {
  readonly type = TO_INVITE_VISITOR
}
export class CancelInviteVisitorAction implements Action {
  readonly type = CANCEL_INVITE_VISITOR
}
export class InviteVisitorAction implements Action {
  readonly type = INVITE_VISITOR
}
export class InviteVisitorSuccessAction implements Action {
  readonly type = INVITE_VISITOR_SUCCESS
}
export class InviteVisitorFailureAction implements Action {
  readonly type = INVITE_VISITOR_FAILURE
}

export class ToInviteVisitorToMicroAppAction implements Action {
  readonly type = TO_INIVITE_VISITOR_TO_MICRO_APP
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
export class UpdateVisitorDetailIDAction implements Action {
  readonly type = UPDATE_VISITOR_DETAIL_ID
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
  constructor(public log: VisitorLogger) {}
}
export class CreateLoggerSuccessAction implements Action {
  readonly type = CREATE_LOGGER_SUCCESS
  constructor(public level: VisitorLoggerLevel) {}
}
export class CreateLoggerFailureAction implements Action {
  readonly type = CREATE_LOGGER_FAILURE
}

export class FetchLoggerAction implements Action {
  readonly type = FETCH_LOGGER
  constructor(public visitorID: string) {}
}
export class FetchLoggerSuccessAction implements Action {
  readonly type = FETCH_LOGGER_SUCCESS
  constructor(public logs: VisitorLogger[]) {}
}
export class FetchLoggerFailureAction implements Action {
  readonly type = FETCH_LOGGER_FAILURE
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
  | FetchVisitorsAction
  | FetchVisitorsSuccessAction
  | FetchVisitorsFailureAction
  | FetchVisitorsCountAction
  | FetchVisitorsCountSuccessAction
  | FetchVisitorsCountFailureAction
  | FetchAreaFilterOptionsAction
  | FetchAreaFilterOptionsSuccessAction
  | FetchAreaFilterOptionsFailureAction
  | FetchTypeFilterOptionsAction
  | FetchTypeFilterOptionsSuccessAction
  | FetchTypeFilterOptionsFailureAction
  | LoadMoreVisitorsAction
  | LoadMoreVisitorsSuccessAction
  | LoadMoreVisitorsFailureAction
  | ToInviteVisitorAction
  | CancelInviteVisitorAction
  | InviteVisitorAction
  | InviteVisitorSuccessAction
  | InviteVisitorFailureAction
  | ToInviteVisitorToMicroAppAction
  | ChangeListStatusAction
  | ChangePageStatusAction
  | TogglePageStatusAction
  | UpdateVisitorDetailIDAction
  | ToCreateLoggerAction
  | CancelCreateLoggerAction
  | CreateLoggerAction
  | CreateLoggerSuccessAction
  | CreateLoggerFailureAction
  | FetchLoggerAction
  | FetchLoggerSuccessAction
  | FetchLoggerFailureAction
