import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromVisitor from './visitor.reducer'
import * as fromToDoMatcher from './todo-matcher.reducer'
import * as fromCompleteMatcher from './complete-matcher.reducer'
import * as fromRoot from '../../../reducers/index'

export interface VisitorState {
  visitor: fromVisitor.State
  toDoMatcher: fromToDoMatcher.State
  completeMatcher: fromCompleteMatcher.State
}

export interface State extends fromRoot.State {
  visitorModule: VisitorState
}

export const reducers = {
  visitor: fromVisitor.reducer,
  toDoMatcher: fromToDoMatcher.reducer,
  completeMatcher: fromCompleteMatcher.reducer
}

export const selectVisitorModuleState = createFeatureSelector<VisitorState>(
  'visitorModule'
)

export const selectVisitorState = createSelector(
  selectVisitorModuleState,
  (state: VisitorState) => state.visitor
)
export const getVisitors = createSelector(
  selectVisitorState,
  fromVisitor.getVisitors
)
export const getTotalVisitorCount = createSelector(
  selectVisitorState,
  fromVisitor.getTotalVisitorCount
)
export const getCurrentVisitorCount = createSelector(
  selectVisitorState,
  fromVisitor.getCurrentVisitorCount
)
export const getVisitorAreaFilters = createSelector(
  selectVisitorState,
  fromVisitor.getAreaFilters
)
export const getVisitorTypeFilters = createSelector(
  selectVisitorState,
  fromVisitor.getTypeFilters
)
export const getVisitorShouldScrollToTop = createSelector(
  selectVisitorState,
  fromVisitor.getShouldScrollToTop
)
export const getListStatus = createSelector(
  selectVisitorState,
  fromVisitor.getListStatus
)
export const getPageStatus = createSelector(
  selectVisitorState,
  fromVisitor.getPageStatus
)
export const getVisitorShowDetailID = createSelector(
  selectVisitorState,
  fromVisitor.getShowDetailID
)
export const getShowVisitorLoadMore = createSelector(
  selectVisitorState,
  fromVisitor.getShowLoadMore
)
export const getLogs = createSelector(selectVisitorState, fromVisitor.getLogs)

export const selectToDoMatcherState = createSelector(
  selectVisitorModuleState,
  (state: VisitorState) => state.toDoMatcher
)
export const getToDoMatchers = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getMatchers
)
export const getToDoMatcherTotalCount = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getMatcherTotalCount
)
export const getCurrentToDoMatcherCount = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getCurrentMatcherCount
)
export const getShowToDoMatcherLoadMore = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getShowLoadMore
)
export const getToDoMatcherShouldScrollToTop = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getShouldScrollToTop
)

export const selectCompleteMatcherState = createSelector(
  selectVisitorModuleState,
  (state: VisitorState) => state.completeMatcher
)
export const getCompleteMatchers = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getMatchers
)
export const getCompleteMatcherTotalCount = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getMatcherTotalCount
)
export const getCurrentCompleteMatcherCount = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getCurrentMatcherCount
)
export const getShowCompleteMatcherLoadMore = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getShowLoadMore
)
export const getCompleteMatcherDetailID = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getMatcherDetailID
)
export const getCompleteMatcherShouldScrollToTop = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getShouldScrollToTop
)
export const getCompleteMatcherVisitorShowDetailID = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getVisitorDetailID
)
