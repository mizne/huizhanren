import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromRecommend from './recommend.reducer'
import * as fromMatcher from './matcher.reducer'
import * as fromRoot from '../../../reducers/index'

export interface RecommendState {
  recommend: fromRecommend.State
  matcher: fromMatcher.State
}

export interface State extends fromRoot.State {
  recommendModule: RecommendState
}

export const reducers = {
  recommend: fromRecommend.reducer,
  matcher: fromMatcher.reducer
}

export const selectRecommendModuleState = createFeatureSelector<RecommendState>('recommendModule')


export const selectRecommendState = createSelector(
  selectRecommendModuleState,
  (state: RecommendState) => state.recommend
)
export const getRecommends = createSelector(selectRecommendState, fromRecommend.getRecommends)
export const getRecommendTotalCount = createSelector(selectRecommendState, fromRecommend.getRecommendTotalCount)
export const getListStatus = createSelector(selectRecommendState, fromRecommend.getListStatus)
export const getPageStatus = createSelector(selectRecommendState, fromRecommend.getPageStatus)
export const getShowDetailID = createSelector(selectRecommendState, fromRecommend.getShowDetailID)


export const selectMatcherState = createSelector(
  selectRecommendModuleState,
  (state: RecommendState) => state.matcher
)
export const getMatchers = createSelector(selectMatcherState, fromMatcher.getMatchers)
export const getMatcherTotalCount = createSelector(selectMatcherState, fromMatcher.getMatcherTotalCount)


