import { Action } from '@ngrx/store'
import {
  VisitorMatcher,
  FetchMatcherParams,
  VisitorMatcherStatus,
  VisitorMatcherDirection
} from '../models/matcher.model'

export const FETCH_COMPLETE_MATCHERS = '[Visitor] Fetch Complete Matchers'
export const FETCH_COMPLETE_MATCHERS_SUCCESS =
  '[Visitor] Fetch Complete Matchers Success'
export const FETCH_COMPLETE_MATCHERS_FAILURE =
  '[Visitor] Fetch Complete Matchers Failure'

export const FETCH_COMPLETE_MATCHERS_COUNT =
  '[Visitor] Fetch Complete Matchers Count'
export const FETCH_COMPLETE_MATCHERS_COUNT_SUCCESS =
  '[Visitor] Fetch Complete Matchers Count Success'
export const FETCH_COMPLETE_MATCHERS_COUNT_FAILURE =
  '[Visitor] Fetch Complete Matchers Count Failure'

export const LOAD_MORE_COMPLETE_MATCHERS =
  '[Visitor] Load More Complete Matchers'
export const LOAD_MORE_COMPLETE_MATCHERS_SUCCESS =
  '[Visitor] Load More Complete Matchers Success'
export const LOAD_MORE_COMPLETE_MATCHERS_FAILURE =
  '[Visitor] Load More Complete Matchers Failure'

export const UPDATE_COMPLETE_MATCHER_DETAIL_ID =
  '[Visitor] Update Matcher Detail ID'

export class FetchCompleteMatchersAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS
  constructor(
    public payload: FetchMatcherParams
  ) {}
}
export class FetchCompleteMatchersSuccessAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_SUCCESS
  constructor(public matchers: VisitorMatcher[]) {}
}
export class FetchCompleteMatchersFailureAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_FAILURE
}

export class FetchCompleteMatchersCountAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_COUNT
  constructor(public params: VisitorMatcherDirection) {}
}
export class FetchCompleteMatchersCountSuccessAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_COUNT_SUCCESS
  constructor(public count: number) {}
}
export class FetchCompleteMatchersCountFailureAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_COUNT_FAILURE
}

export class LoadMoreCompleteMatchersAction implements Action {
  readonly type = LOAD_MORE_COMPLETE_MATCHERS
  constructor(public params: VisitorMatcherDirection) {}
}
export class LoadMoreCompleteMatchersSuccessAction implements Action {
  readonly type = LOAD_MORE_COMPLETE_MATCHERS_SUCCESS
  constructor(public matchers: VisitorMatcher[]) {}
}
export class LoadMoreCompleteMatchersFailureAction implements Action {
  readonly type = LOAD_MORE_COMPLETE_MATCHERS_FAILURE
}

export class UpdateCompleteMatcherDetailIDAction implements Action {
  readonly type = UPDATE_COMPLETE_MATCHER_DETAIL_ID
  constructor(public detailID: string) {}
}

export type Actions =
  | FetchCompleteMatchersAction
  | FetchCompleteMatchersSuccessAction
  | FetchCompleteMatchersFailureAction
  | FetchCompleteMatchersCountAction
  | FetchCompleteMatchersCountSuccessAction
  | FetchCompleteMatchersCountFailureAction
  | LoadMoreCompleteMatchersAction
  | LoadMoreCompleteMatchersSuccessAction
  | LoadMoreCompleteMatchersFailureAction
  | UpdateCompleteMatcherDetailIDAction
