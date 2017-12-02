import { createFeatureSelector, createSelector } from '@ngrx/store'
import * as fromApp from '../app/app.reducer'

export interface State {
  rootPage: fromApp.State
}

export const reducers = {
  rootPage: fromApp.reducer
}

export const getAppState = createFeatureSelector<fromApp.State>('rootPage')
export const getRootPageState = createSelector(
  getAppState,
  fromApp.getRootPage
)

