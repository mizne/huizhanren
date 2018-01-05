import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromExhibitor from './exhibitor.reducer'
import * as fromMatcher from './matcher.reducer'
import * as fromRoot from '../../../reducers/index'

export interface ExhibitorState {
  exhibitor: fromExhibitor.State
  matcher: fromMatcher.State
}

export interface State extends fromRoot.State {
  exhibitorsModule: ExhibitorState
}

export const reducers = {
  exhibitor: fromExhibitor.reducer,
  matcher: fromMatcher.reducer
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
export const getListStatus = createSelector(selectExhibitorState, fromExhibitor.getListStatus)
export const getPageStatus = createSelector(selectExhibitorState, fromExhibitor.getPageStatus)
export const getExhibitorShowDetailID = createSelector(selectExhibitorState, fromExhibitor.getShowDetailID)
export const getExhibitorShouldScrollToTop = createSelector(selectExhibitorState, fromExhibitor.getShouldScrollToTop)
export const getCurrentLogs = createSelector(selectExhibitorState, fromExhibitor.getLogs)
export const getShowExhibitorLoadMore = createSelector(
  selectExhibitorState,
  fromExhibitor.getShowLoadMore
)


export const selectMatcherState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.matcher
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
