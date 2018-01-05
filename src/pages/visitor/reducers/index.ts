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

export const selectVisitorModuleState = createFeatureSelector<VisitorState>('visitorModule')


export const selectVisitorState = createSelector(
  selectVisitorModuleState,
  (state: VisitorState) => state.visitor
)
export const getVisitors = createSelector(selectVisitorState, fromVisitor.getVisitors)
export const getTotalVisitorCount = createSelector(selectVisitorState, fromVisitor.getTotalVisitorCount)
export const getCurrentVisitorCount = createSelector(selectVisitorState, fromVisitor.getCurrentVisitorCount)
export const getVisitorShouldScrollToTop = createSelector(selectVisitorState, fromVisitor.getShouldScrollToTop)
export const getListStatus = createSelector(selectVisitorState, fromVisitor.getListStatus)
export const getPageStatus = createSelector(selectVisitorState, fromVisitor.getPageStatus)
export const getVisitorShowDetailID = createSelector(selectVisitorState, fromVisitor.getShowDetailID)
export const getShowVisitorLoadMore = createSelector(
  selectVisitorState,
  fromVisitor.getShowLoadMore
)
export const getLogs = createSelector(selectVisitorState, fromVisitor.getLogs)


export const selectMatcherState = createSelector(
  selectVisitorModuleState,
  (state: VisitorState) => state.matcher
)
export const getMatchers = createSelector(selectMatcherState, fromMatcher.getMatchers)
export const getMatcherTotalCount = createSelector(selectMatcherState, fromMatcher.getMatcherTotalCount)
export const getCurrentMatcherCount = createSelector(selectMatcherState, fromMatcher.getCurrentMatcherCount)
export const getShowMatcherLoadMore = createSelector(
  selectMatcherState,
  fromMatcher.getShowLoadMore
)
export const getMatcherShowDetailID = createSelector(selectMatcherState, fromMatcher.getShowDetailID)
export const getMatcherShouldScrollToTop = createSelector(selectMatcherState, fromMatcher.getShouldScrollToTop)
