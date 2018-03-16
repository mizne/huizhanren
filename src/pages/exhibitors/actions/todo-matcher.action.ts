import { Action } from '@ngrx/store'
import {
  ExhibitorMatcher,
  FetchMatcherParams,
  ExhibitorMatcherStatus
} from '../models/matcher.model'
import { ToDoFilterOptions } from '../components/matcher-filter/matcher-filter.component'

export const FETCH_TODO_MATCHERS = '[Exhibitor] Fetch ToDo Matchers'
export const FETCH_TODO_MATCHERS_SUCCESS =
  '[Exhibitor] Fetch ToDo Matchers Success'
export const FETCH_TODO_MATCHERS_FAILURE =
  '[Exhibitor] Fetch ToDo Matchers Failure'

export const FETCH_TODO_MATCHERS_COUNT = '[Exhibitor] Fetch ToDo Matchers Count'
export const FETCH_TODO_MATCHERS_COUNT_SUCCESS =
  '[Exhibitor] Fetch ToDo Matchers Count Success'
export const FETCH_TODO_MATCHERS_COUNT_FAILURE =
  '[Exhibitor] Fetch ToDo Matchers Count Failure'

export const LOAD_MORE_TODO_MATCHERS = '[Exhibitor] Load More ToDo Matchers'
export const LOAD_MORE_TODO_MATCHERS_SUCCESS =
  '[Exhibitor] Load More ToDo Matchers Success'
export const LOAD_MORE_TODO_MATCHERS_FAILURE =
  '[Exhibitor] Load More ToDo Matchers Failure'

export const UPDATE_TODO_MATCHER_DETAIL_ID =
  '[Exhibitor] Update ToDo Matcher Detail ID'

export const TO_AGREE_TODO_MATCHER = '[Exhibitor] To Agree ToDo Matcher'
export const CANCEL_AGREE_TODO_MATCHER = '[Exhibitor] Cancel Agree ToDo Matcher'
export const AGREE_TODO_MATCHER = '[Exhibitor] Agree ToDo Matcher'
export const AGREE_TODO_MATCHER_SUCCESS = '[Exhibitor] Agree ToDo Matcher Success'
export const AGREE_TODO_MATCHER_FAILURE = '[Exhibitor] Agree ToDo Matcher Failure'

export const TO_BATCH_AGREE_TODO_MATCHERS = '[Exhibitor] To Batch Agree Matchers'
export const CANCEL_BATCH_AGREE_TODO_MATCHERS =
  '[Exhibitor] Cancel Batch Agree Matchers'
export const BATCH_AGREE_TODO_MATCHERS = '[Exhibitor] Batch Agree Matchers'
export const BATCH_AGREE_TODO_MATCHERS_SUCCESS =
  '[Exhibitor] Batch Agree Matchers Success'
export const BATCH_AGREE_TODO_MATCHERS_FAILURE =
  '[Exhibitor] Batch Agree Matchers Failure'

export const TO_REFUSE_TODO_MATCHER = '[Exhibitor] To Refuse ToDo Matcher'
export const CANCEL_REFUSE_TODO_MATCHER = '[Exhibitor] Cancel Refuse ToDo Matcher'
export const REFUSE_TODO_MATCHER = '[Exhibitor] Refuse ToDo Matcher'
export const REFUSE_TODO_MATCHER_SUCCESS = '[Exhibitor] Refuse ToDo Matcher Success'
export const REFUSE_TODO_MATCHER_FAILURE = '[Exhibitor] Refuse ToDo Matcher Failure'

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class FetchToDoMatchersAction implements Action {
  readonly type = FETCH_TODO_MATCHERS
  constructor(
    public payload: FetchMatcherParams
  ) {}
}
export class FetchToDoMatchersSuccessAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_SUCCESS
  constructor(public matchers: ExhibitorMatcher[]) {}
}
export class FetchToDoMatchersFailureAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_FAILURE
}

export class FetchToDoMatchersCountAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_COUNT
  constructor(public params: ToDoFilterOptions) {}
}
export class FetchToDoMatchersCountSuccessAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_COUNT_SUCCESS
  constructor(public count: number) {}
}
export class FetchToDoMatchersCountFailureAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_COUNT_FAILURE
}

export class LoadMoreToDoMatchersAction implements Action {
  readonly type = LOAD_MORE_TODO_MATCHERS
  constructor(public params: ToDoFilterOptions) {}
}
export class LoadMoreToDoMatchersSuccessAction implements Action {
  readonly type = LOAD_MORE_TODO_MATCHERS_SUCCESS
  constructor(public matchers: ExhibitorMatcher[]) {}
}
export class LoadMoreToDoMatchersFailureAction implements Action {
  readonly type = LOAD_MORE_TODO_MATCHERS_FAILURE
}

export class UpdateToDoMatcherDetailIDAction implements Action {
  readonly type = UPDATE_TODO_MATCHER_DETAIL_ID
  constructor(public detailID: string) {}
}

export class ToAgreeToDoMatcherAction implements Action {
  readonly type = TO_AGREE_TODO_MATCHER
  constructor(public matcherId: string) {}
}
export class CancelAgreeToDoMatcherAction implements Action {
  readonly type = CANCEL_AGREE_TODO_MATCHER
}
export class AgreeToDoMatcherAction implements Action {
  readonly type = AGREE_TODO_MATCHER
  constructor(public matcherId: string) {}
}
export class AgreeToDoMatcherSuccessAction implements Action {
  readonly type = AGREE_TODO_MATCHER_SUCCESS
  constructor(public id: string) {}
}
export class AgreeToDoMatcherFailureAction implements Action {
  readonly type = AGREE_TODO_MATCHER_FAILURE
}

export class ToBatchAgreeToDoMatchersAction implements Action {
  readonly type = TO_BATCH_AGREE_TODO_MATCHERS
}
export class CancelBatchAgreeToDoMatchersAction implements Action {
  readonly type = CANCEL_BATCH_AGREE_TODO_MATCHERS
  constructor(public message?: string) {}
}
export class BatchAgreeToDoMatchersAction implements Action {
  readonly type = BATCH_AGREE_TODO_MATCHERS
}
export class BatchAgreeToDoMatchersSuccessAction implements Action {
  readonly type = BATCH_AGREE_TODO_MATCHERS_SUCCESS
}
export class BatchAgreeToDoMatchersFailureAction implements Action {
  readonly type = BATCH_AGREE_TODO_MATCHERS_FAILURE
}

export class ToRefuseToDoMatcherAction implements Action {
  readonly type = TO_REFUSE_TODO_MATCHER
  constructor(public matcherId: string) {}
}
export class CancelRefuseToDoMatcherAction implements Action {
  readonly type = CANCEL_REFUSE_TODO_MATCHER
}
export class RefuseToDoMatcherAction implements Action {
  readonly type = REFUSE_TODO_MATCHER
  constructor(public matcherId: string) {}
}
export class RefuseToDoMatcherSuccessAction implements Action {
  readonly type = REFUSE_TODO_MATCHER_SUCCESS
  constructor(public id: string) {}
}
export class RefuseToDoMatcherFailureAction implements Action {
  readonly type = REFUSE_TODO_MATCHER_FAILURE
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
  | FetchToDoMatchersAction
  | FetchToDoMatchersSuccessAction
  | FetchToDoMatchersFailureAction
  | FetchToDoMatchersCountAction
  | FetchToDoMatchersCountSuccessAction
  | FetchToDoMatchersCountFailureAction
  | LoadMoreToDoMatchersAction
  | LoadMoreToDoMatchersSuccessAction
  | LoadMoreToDoMatchersFailureAction
  | UpdateToDoMatcherDetailIDAction
  | ToAgreeToDoMatcherAction
  | CancelAgreeToDoMatcherAction
  | AgreeToDoMatcherAction
  | AgreeToDoMatcherSuccessAction
  | AgreeToDoMatcherFailureAction
  | ToBatchAgreeToDoMatchersAction
  | CancelBatchAgreeToDoMatchersAction
  | BatchAgreeToDoMatchersAction
  | BatchAgreeToDoMatchersSuccessAction
  | BatchAgreeToDoMatchersFailureAction
  | ToRefuseToDoMatcherAction
  | CancelRefuseToDoMatcherAction
  | RefuseToDoMatcherAction
  | RefuseToDoMatcherSuccessAction
  | RefuseToDoMatcherFailureAction
