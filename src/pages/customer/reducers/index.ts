import { createSelector, createFeatureSelector } from '@ngrx/store'

import * as fromRoot from '../../../reducers/index'
import * as fromCustomer from './customer.reducer'
import * as fromLogger from './logger.reducer'
import * as fromSms from './sms.reducer'
import * as fromNotification from './notification.reducer'
import * as fromCard from './card.reducer'
import * as fromHelper from './helper.reducer'


export interface CustomerState {
  customer: fromCustomer.State
  logger: fromLogger.State
  sms: fromSms.State
  notification: fromNotification.State
  card: fromCard.State
  helper: fromHelper.State
}

export interface State extends fromRoot.State {
  customer: CustomerState
}

export const reducers = {
  customer: fromCustomer.reducer,
  logger: fromLogger.reducer,
  sms: fromSms.reducer,
  notification: fromNotification.reducer,
  card: fromCard.reducer,
  helper: fromHelper.reducer
}

export const selectCustomerModuleState = createFeatureSelector<CustomerState>('customer')
export const selectCustomerState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.customer
)
export const getCustomers = createSelector(selectCustomerState, fromCustomer.getCustomers)
export const getCustomerPageStatus = createSelector(selectCustomerState, fromCustomer.getCustomerPageStatus)
export const getGroups = createSelector(selectCustomerState, fromCustomer.getGroups)
export const getManageableStatus = createSelector(selectCustomerState, fromCustomer.getManageableStatus)
export const getSelectedCustomers = createSelector(selectCustomerState, fromCustomer.getSelectedCustomers)
export const getPhonesToSendOfCustomers = createSelector(selectCustomerState, fromCustomer.getPhonesToSendOfCustomers)
export const getShowDetailCustomerId = createSelector(selectCustomerState, fromCustomer.getShowDetailCustomerId)
export const getShowDetailGroupId = createSelector(selectCustomerState, fromCustomer.getShowDetailGroupId)
export const getShowLog = createSelector(selectCustomerState, fromCustomer.getShowLog)
export const getShowNotification = createSelector(selectCustomerState, fromCustomer.getShowNotification)

export const selectLoggerState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.logger
)
export const getLogs = createSelector(selectLoggerState, fromLogger.getLogs)


export const selectSmsState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.sms
)
export const getSmsTemplates = createSelector(selectSmsState, fromSms.getSmsTemplates)


export const selectNotificationState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.notification
)
export const getNotifications = createSelector(selectNotificationState, fromNotification.getNotifications)


export const selectCardState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.card
)
export const getFields1 = createSelector(selectCardState, fromCard.getFields1)
export const getFields2 = createSelector(selectCardState, fromCard.getFields2)
export const getCardImg = createSelector(selectCardState, fromCard.getCardImg)
export const getCardBehindImg = createSelector(selectCardState, fromCard.getCardBehindImg)
export const getCardInfo = createSelector(selectCardState, fromCard.getCardInfo)


export const selectHelperState = createSelector(
  selectCustomerModuleState,
  (state: CustomerState) => state.helper
)
export const needShowHelpOfToggleLog = createSelector(selectHelperState, fromHelper.needShowHelpOfToggleLog)