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

export const selectExhibitorModuleState = createFeatureSelector<ExhibitorState>('exhibitorsModule')


export const selectExhibitorState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.exhibitor
)
export const getExhibitors = createSelector(selectExhibitorState, fromExhibitor.getExhibitors)
export const getExhibitorsTotalCount = createSelector(selectExhibitorState, fromExhibitor.getExhibitorsTotalCount)
export const getListStatus = createSelector(selectExhibitorState, fromExhibitor.getListStatus)
export const getPageStatus = createSelector(selectExhibitorState, fromExhibitor.getPageStatus)
export const getShowDetailID = createSelector(selectExhibitorState, fromExhibitor.getShowDetailID)
export const getCurrentLogs = createSelector(selectExhibitorState, fromExhibitor.getLogs)


export const selectMatcherState = createSelector(
  selectExhibitorModuleState,
  (state: ExhibitorState) => state.matcher
)
export const getMatchers = createSelector(selectMatcherState, fromMatcher.getMatchers)
export const getMatcherTotalCount = createSelector(selectMatcherState, fromMatcher.getMatcherTotalCount)

