import { Action } from '@ngrx/store'
import {
  VisitorMatcher,
  FetchMatcherParams,
  VisitorMatcherStatus,
  VisitorMatcherDirection
} from '../models/matcher.model'
import { ToDoFilterOptions } from '../components/matcher-filter/matcher-filter.component'

export const FETCH_TODO_MATCHERS = '[Visitor] Fetch ToDo Matchers'
export const FETCH_TODO_MATCHERS_SUCCESS =
  '[Visitor] Fetch ToDo Matchers Success'
export const FETCH_TODO_MATCHERS_FAILURE =
  '[Visitor] Fetch ToDo Matchers Failure'

export const FETCH_TODO_MATCHERS_COUNT = '[Visitor] Fetch ToDo Matchers Count'
export const FETCH_TODO_MATCHERS_COUNT_SUCCESS =
  '[Visitor] Fetch ToDo Matchers Count Success'
export const FETCH_TODO_MATCHERS_COUNT_FAILURE =
  '[Visitor] Fetch ToDo Matchers Count Failure'

export const LOAD_MORE_TODO_MATCHERS = '[Visitor] Load More ToDo Matchers'
export const LOAD_MORE_TODO_MATCHERS_SUCCESS =
  '[Visitor] Load More ToDo Matchers Success'
export const LOAD_MORE_TODO_MATCHERS_FAILURE =
  '[Visitor] Load More ToDo Matchers Failure'

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
    public payload: FetchMatcherParams = {
      pageIndex: 1,
      pageSize: 10
    }
  ) {}
}
export class FetchToDoMatchersSuccessAction implements Action {
  readonly type = FETCH_TODO_MATCHERS_SUCCESS
  constructor(public matchers: VisitorMatcher[]) {}
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
  constructor(public matchers: VisitorMatcher[]) {}
}
export class LoadMoreToDoMatchersFailureAction implements Action {
  readonly type = LOAD_MORE_TODO_MATCHERS_FAILURE
}

export class ToAgreeMatcherAction implements Action {
  readonly type = TO_AGREE_MATCHER
  constructor(public matcherId: string) {}
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
  constructor(public id: string) {}
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
  constructor(public id: string) {}
}
export class RefuseMatcherFailureAction implements Action {
  readonly type = REFUSE_MATCHER_FAILURE
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
  | ToAgreeMatcherAction
  | CancelAgreeMatcherAction
  | AgreeMatcherAction
  | AgreeMatcherSuccessAction
  | AgreeMatcherFailureAction
  | ToRefuseMatcherAction
  | CancelRefuseMatcherAction
  | RefuseMatcherAction
  | RefuseMatcherSuccessAction
  | RefuseMatcherFailureAction
