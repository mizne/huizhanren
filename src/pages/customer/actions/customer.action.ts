import { Action } from '@ngrx/store'
import { Customer } from '../models/customer.model'
import { ContactLogger } from '../models/logger.model'
import { InitFetchAllResp } from '../services/customer.service'

export const INITIAL = '[Customer] Initial Groups And Customers'
export const INITIAL_SUCCESS = '[Customer] Initial Groups And Customers Success'
export const INITIAL_FAILURE = '[Customer] Initial Groups And Customers Failure'

export const PRE_CREATE = '[Customer] Pre Create'
export const CANCEL_CREATE = '[Customer] Cancel Create'
export const CREATE = '[Customer] Create'
export const CREATE_SUCCESS = '[Customer] Create Success'
export const CREATE_SYS_LOGGER = '[Customer] Create Sys Logger'
export const CREATE_SYS_LOGGER_SUCCESS = '[Customer] Create Sys Logger Success'
export const CREATE_SYS_LOGGER_FAILURE = '[Customer] Create Sys Logger Failure'
export const CREATE_FAILURE = '[Customer] Create Failure'

export const FETCH_ALL = '[Customer] Fetch All'
export const FETCH_ALL_SUCCESS = '[Customer] Fetch All Success'
export const FETCH_ALL_FAILURE = '[Customer] Fetch All Failure'

export const FETCH_SINGLE = '[Customer] Fetch Single'
export const FETCH_SINGLE_SUCCESS = '[Customer] Fetch Single Success'
export const FETCH_SINGLE_FAILURE = '[Customer] Fetch Single Failure'

export const PRE_BATCH_EDIT_GROUP = '[Customer] Pre Batch Edit Group'
export const CANCEL_BATCH_EDIT_GROUP = '[Customer] Cancel Batch Edit Group'
export const BATCH_EDIT_GROUP = '[Customer] Batch Edit Group'
export const BATCH_EDIT_GROUP_SUCCESS = '[Customer] Batch Edit Group Success'
export const BATCH_EDIT_GROUP_FAILURE = '[Customer] Batch Edit Group Failure'

export const TO_SINGLE_EDIT_GROUP = '[Customer] To Single Edit Group'
export const CANCEL_SINGLE_EDIT_GROUP = '[Customer] Cancel Single Edit Group'
export const SINGLE_EDIT_GROUP = '[Customer] Single Edit Group'
export const SINGLE_EDIT_GROUP_SUCCESS = '[Customer] Single Edit Group Success'
export const SINGLE_EDIT_GROUP_FAILURE = '[Customer] Single Edit Group Failure'

export const TO_EDITABLE_STATUS = '[Customer] To Editable Status'
export const TO_DETAILABLE_STATUS = '[Customer] To Detailable Status'
export const TO_MANAGEABLE_STATUS = '[Customer] To Manageable Status'
export const TO_LISTABLE_STATUS = '[Customer] To Listable Status'
export const TO_CREATEABLE_STATUS = '[Customer] To Createable Status'

export const SELECT_CUSTOMER = '[Customer] Select Customer'
export const CANCEL_SELECT_CUSTOMER = '[Customer] Cancel Select Customer'
export const TOGGLE_SHOW_LOG = '[Customer] Toggle Show Log'
export const TOGGLE_SHOW_NOTIFICATION = '[Customer] Toggle Show Notification'

export const PRE_DELETE = '[Customer] Pre Delete'
export const TO_DELETE = '[Customer] To Delete'
export const CANCEL_DELETE = '[Customer] Cancel Delete'
export const ENSURE_DELETE = '[Customer] Ensure Delete'
export const DELETE_SUCCESS = '[Customer] Delete Success'
export const DELETE_FAILURE = '[Customer] Delete Failure'

export const TO_DISCARD = '[Customer] To Discard'
export const CANCEL_DISCARD = '[Customer] Cancel Discard'
export const ENSURE_DISCARD = '[Customer] Ensure Discard'

export const EDIT_CUSTOMER = '[Customer] Edit Customer'
export const EDIT_CUSTOMER_SUCCESS = '[Customer] Edit Customer Success'
export const EDIT_CUSTOMER_FAILURE = '[Customer] Edit Customer Failure'

export const REMOVE_CUSTOMER_GROUPID = '[Customer] Remove Customer GroupId'
export const REMOVE_CUSTOMER_GROUPID_SUCCESS = '[Customer] Remove Customer GroupId Success'
export const REMOVE_CUSTOMER_GROUPID_FAILURE = '[Customer] Remove Customer GroupID Failure'

export const ENSURE_GROUP_SCROLL_TOP = '[Customer] Ensure Group Scroll Top'
/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class InitialAction implements Action {
  readonly type = INITIAL
}

export class InitialSuccessAction implements Action {
  readonly type = INITIAL_SUCCESS
  constructor(public payload: InitFetchAllResp) {}
}

export class InitialFailureAction implements Action {
  readonly type = INITIAL_FAILURE
}



export class PreCreateAction implements Action {
  readonly type = PRE_CREATE
}

export class CancelCreateAction implements Action {
  readonly type = CANCEL_CREATE
}

export class CreateAction implements Action {
  readonly type = CREATE
}

export class CreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS
  constructor(public payload: any) {}
}

export class CreateSysLoggerAction implements Action {
  readonly type = CREATE_SYS_LOGGER
  constructor(public payload: { log: ContactLogger; customerId: string }) {}
}

export class CreateSysLoggerSuccessAction implements Action {
  readonly type = CREATE_SYS_LOGGER_SUCCESS
}

export class CreateSysLoggerFailureAction implements Action {
  readonly type = CREATE_SYS_LOGGER_FAILURE
}

export class CreateFailureAction implements Action {
  readonly type = CREATE_FAILURE
  constructor(public payload: any) {}
}



export class FetchAllAction implements Action {
  readonly type = FETCH_ALL
}
export class FetchAllSuccessAction implements Action {
  readonly type = FETCH_ALL_SUCCESS
  constructor(public customers: Customer[]) {}
}
export class FetchAllFailureAction implements Action {
  readonly type = FETCH_ALL_FAILURE
}


export class FetchSingleAction implements Action {
  readonly type = FETCH_SINGLE
  constructor(public customerId: string) {}
}
export class FetchSingleSuccessAction implements Action {
  readonly type = FETCH_SINGLE_SUCCESS
  constructor(public customer: Customer) {}
}
export class FetchSingleFailureAction implements Action {
  readonly type = FETCH_SINGLE_FAILURE
}


export class PreBatchEditGroupAction implements Action {
  readonly type = PRE_BATCH_EDIT_GROUP
  constructor(public groupId: string) {}
}
export class CancelBatchEditGroupAction implements Action {
  readonly type = CANCEL_BATCH_EDIT_GROUP
}
export class BatchEditGroupAction implements Action {
  readonly type = BATCH_EDIT_GROUP
  constructor(public groupId: string) {}
}

export class BatchEditGroupSuccessAction implements Action {
  readonly type = BATCH_EDIT_GROUP_SUCCESS
}

export class BatchEditGroupFailureAction implements Action {
  readonly type = BATCH_EDIT_GROUP_FAILURE
}



export class ToSingleEditGroupAction implements Action {
  readonly type = TO_SINGLE_EDIT_GROUP
}

export class CancelSingleEditGroupAction implements Action {
  readonly type = CANCEL_SINGLE_EDIT_GROUP
}

export class SingleEditGroupAction implements Action {
  readonly type = SINGLE_EDIT_GROUP
  constructor(public groupId: string) {}
}

export class SingleEditGroupSuccessAction implements Action {
  readonly type = SINGLE_EDIT_GROUP_SUCCESS
}

export class SingleEditGroupFailureAction implements Action {
  readonly type = SINGLE_EDIT_GROUP_FAILURE
}



export class ToEditableStatusAction implements Action {
  readonly type = TO_EDITABLE_STATUS
}

export class ToDetailableStatusAction implements Action {
  readonly type = TO_DETAILABLE_STATUS
  constructor(public payload: { customerId: string; groupId: string }) {}
}

export class ToManageableStatusAction implements Action {
  readonly type = TO_MANAGEABLE_STATUS
}

export class ToListableStatusAction implements Action {
  readonly type = TO_LISTABLE_STATUS
}

export class ToCreateableStatusAction implements Action {
  readonly type = TO_CREATEABLE_STATUS
}



export class SelectCustomerAction implements Action {
  readonly type = SELECT_CUSTOMER
  constructor(public id: string) {}
}

export class CancelSelectCustomerAction implements Action {
  readonly type = CANCEL_SELECT_CUSTOMER
  constructor(public id: string) {}
}

export class ToggleShowLogAction implements Action {
  readonly type = TOGGLE_SHOW_LOG
  constructor(public flag?: boolean) {}
}

export class ToggleShowNotificationAction implements Action {
  readonly type = TOGGLE_SHOW_NOTIFICATION
  constructor(public flag?: boolean) {}
}



export class PreDeleteAction implements Action {
  readonly type = PRE_DELETE
}

export class ToDeleteAction implements Action {
  readonly type = TO_DELETE
  constructor(public multi: boolean) {}
}

export class CancelDeleteAction implements Action {
  readonly type = CANCEL_DELETE
}

export class EnsureDeleteAction implements Action {
  readonly type = ENSURE_DELETE
  constructor(public multi: boolean) {}
}

export class DeleteSuccessAction implements Action {
  readonly type = DELETE_SUCCESS
}

export class DeleteFailureAction implements Action {
  readonly type = DELETE_FAILURE
}



export class ToDiscardAction implements Action {
  readonly type = TO_DISCARD
}

export class CancelDiscardAction implements Action {
  readonly type = CANCEL_DISCARD
}

export class EnsureDiscardAction implements Action {
  readonly type = ENSURE_DISCARD
}



export class EditCustomerAction implements Action {
  readonly type = EDIT_CUSTOMER
}

export class EditCustomerSuccessAction implements Action {
  readonly type = EDIT_CUSTOMER_SUCCESS
}

export class EditCustomerFailureAction implements Action {
  readonly type = EDIT_CUSTOMER_FAILURE
}




export class RemoveCustomerGroupIdAction implements Action {
  readonly type = REMOVE_CUSTOMER_GROUPID
  constructor(public groupId: string) {}
}

export class RemoveCustomerGroupIdSuccessAction implements Action {
  readonly type = REMOVE_CUSTOMER_GROUPID_SUCCESS
}

export class RemoveCustomerGroupIdFailureAction implements Action {
  readonly type = REMOVE_CUSTOMER_GROUPID_FAILURE
}



export class EnsureGroupScrollTopAction implements Action {
  readonly type = ENSURE_GROUP_SCROLL_TOP
  constructor(public payload: { groupId: string, scrollTop: number }) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
  | InitialAction
  | InitialSuccessAction
  | InitialFailureAction

  | PreCreateAction
  | CancelCreateAction
  | CreateAction
  | CreateSuccessAction
  | CreateSysLoggerAction
  | CreateSysLoggerSuccessAction
  | CreateSysLoggerFailureAction
  | CreateFailureAction

  | FetchAllAction
  | FetchAllSuccessAction
  | FetchAllFailureAction

  | FetchSingleAction
  | FetchSingleSuccessAction
  | FetchSingleFailureAction

  | PreBatchEditGroupAction
  | CancelBatchEditGroupAction
  | BatchEditGroupAction
  | BatchEditGroupSuccessAction
  | BatchEditGroupFailureAction

  | ToSingleEditGroupAction
  | CancelSingleEditGroupAction
  | SingleEditGroupAction
  | SingleEditGroupSuccessAction
  | SingleEditGroupFailureAction

  | ToEditableStatusAction
  | ToDetailableStatusAction
  | ToManageableStatusAction
  | ToListableStatusAction
  | ToCreateableStatusAction

  | SelectCustomerAction
  | CancelSelectCustomerAction
  | ToggleShowLogAction
  | ToggleShowNotificationAction

  | PreDeleteAction
  | ToDeleteAction
  | CancelDeleteAction
  | EnsureDeleteAction
  | DeleteSuccessAction
  | DeleteFailureAction

  | ToDiscardAction
  | CancelDiscardAction
  | EnsureDiscardAction

  | EditCustomerAction
  | EditCustomerSuccessAction
  | EditCustomerFailureAction

  | RemoveCustomerGroupIdAction
  | RemoveCustomerGroupIdSuccessAction
  | RemoveCustomerGroupIdFailureAction

  | EnsureGroupScrollTopAction
