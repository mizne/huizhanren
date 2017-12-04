import { createSelector, createFeatureSelector } from '@ngrx/store'
import * as fromVerifyCode from './verify-code.reducer'
import * as fromExhibitions from './exhibitions.reducer'
import * as fromRoot from '../../../reducers/index'

export interface LoginState {
  verifyCode: fromVerifyCode.State
  exhibitions: fromExhibitions.State
}

export interface State extends fromRoot.State {
  login: LoginState
}

export const reducers = {
  verifyCode: fromVerifyCode.reducer,
  exhibitions: fromExhibitions.reducer
}

export const selectLoginModuleState = createFeatureSelector<LoginState>('login')
export const selectVerifyCodeState = createSelector(
  selectLoginModuleState,
  (state: LoginState) => state.verifyCode
)
export const getPhone = createSelector(selectVerifyCodeState, fromVerifyCode.getPhone)
export const getCode = createSelector(selectVerifyCodeState, fromVerifyCode.getCode)


export const selectExhibitionsState = createSelector(
  selectLoginModuleState,
  (state: LoginState) => state.exhibitions
)
export const getAdminName = createSelector(selectExhibitionsState, fromExhibitions.getAdminName)
export const getUserName = createSelector(selectExhibitionsState, fromExhibitions.getUserName)
export const isAdmin = createSelector(selectExhibitionsState, fromExhibitions.isAdmin)
export const getCompanyName = createSelector(selectExhibitionsState, fromExhibitions.getCompanyName)
export const getExhibitions = createSelector(selectExhibitionsState, fromExhibitions.getExhibitions)
export const getSelectedExhibitionId = createSelector(selectExhibitionsState, fromExhibitions.getSelectedExhibitionId)
export const getSelectedExhibitionAddress = createSelector(selectExhibitionsState, fromExhibitions.getSelectedExhibitionAddress)

export const getTenantId = createSelector(selectExhibitionsState, fromExhibitions.getTenantId)
export const getUserId = createSelector(selectExhibitionsState, fromExhibitions.getUserId)
