import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromUserManagement from './user-management.reducer'
import * as fromOther from './other.reducer'
import * as fromRoot from '../../../reducers/index'

export interface SettingsState {
  userManagement: fromUserManagement.State
  other: fromOther.State
}

export interface State extends fromRoot.State {
  settings: SettingsState
}

export const reducers = {
  userManagement: fromUserManagement.reducer,
  other: fromOther.reducer
}

export const selectSettingsModuleState = createFeatureSelector<SettingsState>('settingsModule')


export const selectUserManagementState = createSelector(
  selectSettingsModuleState,
  (state: SettingsState) => state.userManagement
)

export const getUsers = createSelector(selectUserManagementState, fromUserManagement.getUsers)
export const getMaxUserCount = createSelector(selectUserManagementState, fromUserManagement.getMaxUserCount)


export const selectOtherState = createSelector(
  selectSettingsModuleState,
  (state: SettingsState) => state.other
)
export const getUpdateText = createSelector(selectOtherState, fromOther.getUpdateText)
