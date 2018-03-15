import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromExhibitor from './exhibitor.reducer'
import * as fromToDoMatcher from './todo-matcher.reducer'
import * as fromCompleteMatcher from './complete-matcher.reducer'
import * as fromRoot from '../../../reducers/index'

export interface ExhibitorState {
  exhibitor: fromExhibitor.State
  toDoMatcher: fromToDoMatcher.State
  completeMatcher: fromCompleteMatcher.State
}

export interface State extends fromRoot.State {
  exhibitorsModule: ExhibitorState
}

export const reducers = {
  exhibitor: fromExhibitor.reducer,
  toDoMatcher: fromToDoMatcher.reducer,
  completeMatcher: fromCompleteMatcher.reducer
}

export const selectExhibitorModuleState = createFeatureSelector<ExhibitorState>('exhibitorModule')


export const selectExhibitorState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.exhibitor
)
export const getExhibitors = createSelector(selectExhibitorState, fromExhibitor.getExhibitors)
export const getExhibitorsTotalCount = createSelector(selectExhibitorState, fromExhibitor.getExhibitorsTotalCount)
export const getCurrentExhibitorCount = createSelector(
  selectExhibitorState,
  fromExhibitor.getCurrentExhibitorCount
)
export const getExhibitorAreaFilters = createSelector(selectExhibitorState, fromExhibitor.getAreaFilters)
export const getExhibitorTypeFilters = createSelector(selectExhibitorState, fromExhibitor.getTypeFilters)
export const getListStatus = createSelector(selectExhibitorState, fromExhibitor.getListStatus)
export const getPageStatus = createSelector(selectExhibitorState, fromExhibitor.getPageStatus)
export const getExhibitorShowDetailID = createSelector(selectExhibitorState, fromExhibitor.getShowDetailID)
export const getExhibitorShouldScrollToTop = createSelector(selectExhibitorState, fromExhibitor.getShouldScrollToTop)
export const getCurrentLogs = createSelector(selectExhibitorState, fromExhibitor.getLogs)
export const getShowExhibitorLoadMore = createSelector(
  selectExhibitorState,
  fromExhibitor.getShowLoadMore
)


export const selectToDoMatcherState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.toDoMatcher
)
export const getToDoMatchers = createSelector(selectToDoMatcherState, fromToDoMatcher.getMatchers)
export const getToDoMatcherTotalCount = createSelector(selectToDoMatcherState, fromToDoMatcher.getMatcherTotalCount)
export const getCurrentToDoMatcherCount = createSelector(selectToDoMatcherState, fromToDoMatcher.getCurrentMatcherCount)
export const getShowToDoMatcherLoadMore = createSelector(
  selectToDoMatcherState,
  fromToDoMatcher.getShowLoadMore
)
export const getToDoMatcherShowDetailID = createSelector(selectToDoMatcherState, fromToDoMatcher.getShowDetailID)
export const getToDoMatcherShouldScrollToTop = createSelector(selectToDoMatcherState, fromToDoMatcher.getShouldScrollToTop)


export const selectCompleteMatcherState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.completeMatcher
)
export const getCompleteMatchers = createSelector(selectCompleteMatcherState, fromCompleteMatcher.getMatchers)
export const getCompleteMatcherTotalCount = createSelector(selectCompleteMatcherState, fromCompleteMatcher.getMatcherTotalCount)
export const getCurrentCompleteMatcherCount = createSelector(selectCompleteMatcherState, fromCompleteMatcher.getCurrentMatcherCount)
export const getShowCompleteMatcherLoadMore = createSelector(
  selectCompleteMatcherState,
  fromCompleteMatcher.getShowLoadMore
)
export const getCompleteMatcherShowDetailID = createSelector(selectCompleteMatcherState, fromCompleteMatcher.getShowDetailID)
export const getCompleteMatcherShouldScrollToTop = createSelector(selectCompleteMatcherState, fromCompleteMatcher.getShouldScrollToTop)
