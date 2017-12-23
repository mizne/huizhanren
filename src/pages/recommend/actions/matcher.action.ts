import { Action } from '@ngrx/store'
import { Matcher, FetchMatcherParams } from '../models/matcher.model'

export const FETCH_MATCHERS = '[Recommend] Fetch Matchers'
export const FETCH_MATCHERS_SUCCESS = '[Recommend] Fetch Matchers Success'
export const FETCH_MATCHERS_FAILURE = '[Recommend] Fetch Matchers Failure'

export const TO_AGREE_MATCHER = '[Recommend] To Agree Matcher'
export const CANCEL_AGREE_MATCHER = '[Recommend] Cancel Agree Matcher'
export const AGREE_MATCHER = '[Recommend] Agree Matcher'
export const AGREE_MATCHER_SUCCESS = '[Recommend] Agree Matcher Success'
export const AGREE_MATCHER_FAILURE = '[Recommend] Agree Matcher Failure'

export const TO_REFUSE_MATCHER = '[Recommend] To Refuse Matcher'
export const CANCEL_REFUSE_MATCHER = '[Recommend] Cancel Refuse Matcher'
export const REFUSE_MATCHER = '[Recommend] Refuse Matcher'
export const REFUSE_MATCHER_SUCCESS = '[Recommend] Refuse Matcher Success'
export const REFUSE_MATCHER_FAILURE = '[Recommend] Refuse Matcher Failure'

export const TO_CANCEL_MATCHER = '[Recommend] To Cancel Matcher'
export const CANCEL_CANCEL_MATCHER = '[Recommend] Cancel Cancel Matcher'
export const CANCEL_MATCHER = '[Recommend] Cancel Matcher'
export const CANCEL_MATCHER_SUCCESS = '[Recommend] Cancel Matcher Success'
export const CANCEL_MATCHER_FAILURE = '[Recommend] Cancel Matcher Failure'
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
  constructor(public matchers: Matcher[]) {}
}
export class FetchMatchersFailureAction implements Action {
  readonly type = FETCH_MATCHERS_FAILURE
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
