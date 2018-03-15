import { Action } from '@ngrx/store'
import {
  ExhibitorMatcher,
  FetchMatcherParams,
  ExhibitorMatcherStatus,
  ExhibitorMatcherDirection
} from '../models/matcher.model'

export const FETCH_COMPLETE_MATCHERS = '[Exhibitor] Fetch Complete Matchers'
export const FETCH_COMPLETE_MATCHERS_SUCCESS =
  '[Exhibitor] Fetch Complete Matchers Success'
export const FETCH_COMPLETE_MATCHERS_FAILURE =
  '[Exhibitor] Fetch Complete Matchers Failure'

export const FETCH_COMPLETE_MATCHERS_COUNT =
  '[Exhibitor] Fetch Complete Matchers Count'
export const FETCH_COMPLETE_MATCHERS_COUNT_SUCCESS =
  '[Exhibitor] Fetch Complete Matchers Count Success'
export const FETCH_COMPLETE_MATCHERS_COUNT_FAILURE =
  '[Exhibitor] Fetch Complete Matchers Count Failure'

export const LOAD_MORE_COMPLETE_MATCHERS =
  '[Exhibitor] Load More Complete Matchers'
export const LOAD_MORE_COMPLETE_MATCHERS_SUCCESS =
  '[Exhibitor] Load More Complete Matchers Success'
export const LOAD_MORE_COMPLETE_MATCHERS_FAILURE =
  '[Exhibitor] Load More Complete Matchers Failure'

export const UPDATE_COMPLETE_MATCHER_DETAIL_ID =
  '[Exhibitor] Update Matcher Detail ID'

export class FetchCompleteMatchersAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS
  constructor(
    public payload: FetchMatcherParams = {
      pageIndex: 1,
      pageSize: 10,
      statuses: [ExhibitorMatcherStatus.AGREE],
      direction: ExhibitorMatcherDirection.ANY
    }
  ) {}
}
export class FetchCompleteMatchersSuccessAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_SUCCESS
  constructor(public matchers: ExhibitorMatcher[]) {}
}
export class FetchCompleteMatchersFailureAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_FAILURE
}

export class FetchCompleteMatchersCountAction implements Action {
  readonly type = FETCH_COMPLETE_MATCHERS_COUNT
  constructor(public params: ExhibitorMatcherDirection) {}
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
  constructor(public params: ExhibitorMatcherDirection) {}
}
export class LoadMoreCompleteMatchersSuccessAction implements Action {
  readonly type = LOAD_MORE_COMPLETE_MATCHERS_SUCCESS
  constructor(public matchers: ExhibitorMatcher[]) {}
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
