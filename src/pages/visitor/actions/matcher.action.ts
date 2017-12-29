import { Action } from '@ngrx/store'
import { VisitorMatcher, FetchMatcherParams, VisitorMatcherStatus } from '../models/matcher.model'

export const FETCH_MATCHERS = '[Visitor] Fetch Matchers'
export const FETCH_MATCHERS_SUCCESS = '[Visitor] Fetch Matchers Success'
export const FETCH_MATCHERS_FAILURE = '[Visitor] Fetch Matchers Failure'

export const FETCH_MATCHERS_COUNT = '[Visitor] Fetch Matchers Count'
export const FETCH_MATCHERS_COUNT_SUCCESS = '[Visitor] Fetch Matchers Count Success'
export const FETCH_MATCHERS_COUNT_FAILURE = '[Visitor] Fetch Matchers Count Failure'

export const LOAD_MORE_MATCHERS = '[Visitor] Load More Matchers'
export const LOAD_MORE_MATCHERS_SUCCESS = '[Visitor] Load More Matchers Success'
export const LOAD_MORE_MATCHERS_FAILURE = '[Visitor] Load More Matchers Failure'

export const TO_AGREE_MATCHER = '[Visitor] To Agree Matcher'
export const CANCEL_AGREE_MATCHER = '[Visitor] Cancel Agree Matcher'
export const AGREE_MATCHER = '[Visitor] Agree Matcher'
export const AGREE_MATCHER_SUCCESS = '[Visitor] Agree Matcher Success'
export const AGREE_MATCHER_FAILURE = '[Visitor] Agree Matcher Failure'

export const TO_REFUSE_MATCHER = '[Visitor] To Refuse Matcher'
export const CANCEL_REFUSE_MATCHER = '[Visitor] Cancel Refuse Matcher'
export const REFUSE_MATCHER = '[Visitor] Refuse Matcher'
export const REFUSE_MATCHER_SUCCESS = '[Visitor] Refuse Matcher Success'
export const REFUSE_MATCHER_FAILURE = '[Visitor] Refuse Matcher Failure'

export const TO_CANCEL_MATCHER = '[Visitor] To Cancel Matcher'
export const CANCEL_CANCEL_MATCHER = '[Visitor] Cancel Cancel Matcher'
export const CANCEL_MATCHER = '[Visitor] Cancel Matcher'
export const CANCEL_MATCHER_SUCCESS = '[Visitor] Cancel Matcher Success'
export const CANCEL_MATCHER_FAILURE = '[Visitor] Cancel Matcher Failure'
/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */


export class FetchMatchersAction implements Action {
  readonly type = FETCH_MATCHERS
  constructor(public payload: FetchMatcherParams = {
    pageIndex: 1,
    pageSize: 10
  }) {}
}
export class FetchMatchersSuccessAction implements Action {
  readonly type = FETCH_MATCHERS_SUCCESS
  constructor(public matchers: VisitorMatcher[]) {}
}
export class FetchMatchersFailureAction implements Action {
  readonly type = FETCH_MATCHERS_FAILURE
}


export class FetchMatchersCountAction implements Action {
  readonly type = FETCH_MATCHERS_COUNT
}
export class FetchMatchersCountSuccessAction implements Action {
  readonly type = FETCH_MATCHERS_COUNT_SUCCESS
  constructor(public count: number) {}
}
export class FetchMatchersCountFailureAction implements Action {
  readonly type = FETCH_MATCHERS_COUNT_FAILURE
}


export class LoadMoreMatchersAction implements Action {
  readonly type = LOAD_MORE_MATCHERS
  constructor(public matcherStatuses: VisitorMatcherStatus[]) {}
}
export class LoadMoreMatchersSuccessAction implements Action {
  readonly type = LOAD_MORE_MATCHERS_SUCCESS
  constructor(public matchers: VisitorMatcher[]) {}
}
export class LoadMoreMatchersFailureAction implements Action {
  readonly type = LOAD_MORE_MATCHERS_FAILURE
}


export class ToAgreeMatcherAction implements Action {
  readonly type = TO_AGREE_MATCHER
  constructor(public matcherId: string)　{}
}
export class CancelAgreeMatcherAction implements Action {
  readonly type = CANCEL_AGREE_MATCHER
}
export class AgreeMatcherAction implements Action {
  readonly type = AGREE_MATCHER
  constructor(public matcherId: string) {}
}
export class AgreeMatcherSuccessAction implements Action {
  readonly type = AGREE_MATCHER_SUCCESS
}
export class AgreeMatcherFailureAction implements Action {
  readonly type = AGREE_MATCHER_FAILURE
}


export class ToRefuseMatcherAction implements Action {
  readonly type = TO_REFUSE_MATCHER
  constructor(public matcherId: string) {}
}
export class CancelRefuseMatcherAction implements Action {
  readonly type = CANCEL_REFUSE_MATCHER
}
export class RefuseMatcherAction implements Action {
  readonly type = REFUSE_MATCHER
  constructor(public matcherId: string) {}
}
export class RefuseMatcherSuccessAction implements Action {
  readonly type = REFUSE_MATCHER_SUCCESS
}
export class RefuseMatcherFailureAction implements Action {
  readonly type = REFUSE_MATCHER_FAILURE
}


export class ToCancelMatcherAction implements Action {
  readonly type = TO_CANCEL_MATCHER
  constructor(public matcherId: string) {}
}
export class CancelCancelMatcherAction implements Action {
  readonly type = CANCEL_CANCEL_MATCHER
}
export class CancelMatcherAction implements Action {
  readonly type = CANCEL_MATCHER
  constructor(public matcherId: string) {}
}
export class CancelMatcherSuccessAction implements Action {
  readonly type = CANCEL_MATCHER_SUCCESS
}
export class CancelMatcherFailureAction implements Action {
  readonly type = CANCEL_MATCHER_FAILURE
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
FetchMatchersAction |
FetchMatchersSuccessAction |
FetchMatchersFailureAction |

FetchMatchersCountAction |
FetchMatchersCountSuccessAction |
FetchMatchersCountFailureAction |

LoadMoreMatchersAction |
LoadMoreMatchersSuccessAction |
LoadMoreMatchersFailureAction |

ToAgreeMatcherAction |
CancelAgreeMatcherAction |
AgreeMatcherAction |
AgreeMatcherSuccessAction |
AgreeMatcherFailureAction |

ToRefuseMatcherAction |
CancelRefuseMatcherAction |
RefuseMatcherAction |
RefuseMatcherSuccessAction |
RefuseMatcherFailureAction |

ToCancelMatcherAction |
CancelCancelMatcherAction |
CancelMatcherAction |
CancelMatcherSuccessAction |
CancelMatcherFailureAction
