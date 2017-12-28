import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromVisitor from './visitor.reducer'
import * as fromMatcher from './matcher.reducer'
import * as fromRoot from '../../../reducers/index'

export interface VisitorState {
  visitor: fromVisitor.State
  matcher: fromMatcher.State
}

export interface State extends fromRoot.State {
  visitorModule: VisitorState
}

export const reducers = {
  visitor: fromVisitor.reducer,
  matcher: fromMatcher.reducer
}

export const selectRecommendModuleState = createFeatureSelector<VisitorState>('visitorModule')


export const selectRecommendState = createSelector(
  selectRecommendModuleState,
  (state: VisitorState) => state.visitor
)
export const getVisitors = createSelector(selectRecommendState, fromVisitor.getVisitors)
export const getRecommendTotalCount = createSelector(selectRecommendState, fromVisitor.getVisitorsTotalCount)
export const getListStatus = createSelector(selectRecommendState, fromVisitor.getListStatus)
export const getPageStatus = createSelector(selectRecommendState, fromVisitor.getPageStatus)
export const getShowDetailID = createSelector(selectRecommendState, fromVisitor.getShowDetailID)
export const getShowRecommendLoadMore = createSelector(
  selectRecommendState,
  fromVisitor.getShowLoadMore
)


export const selectMatcherState = createSelector(
  selectRecommendModuleState,
  (state: VisitorState) => state.matcher
)
export const getMatchers = createSelector(selectMatcherState, fromMatcher.getMatchers)
export const getMatcherTotalCount = createSelector(selectMatcherState, fromMatcher.getMatcherTotalCount)
export const getLogs = createSelector(selectRecommendState, fromVisitor.getLogs)
export const getShowMatcherLoadMore = createSelector(
  selectMatcherState,
  fromMatcher.getShowLoadMore
)

