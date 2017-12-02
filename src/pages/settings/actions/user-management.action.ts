import { Action } from '@ngrx/store'

import { User } from '../models/user.model'

export const FETCH_ALL_USER = '[Settings] Fetch All User'
export const FETCH_ALL_USER_SUCCESS = '[Settings] Fetch All User Success'
export const FETCH_ALL_USER_FAILURE = '[Settings] Fetch All User Failure'

export const TO_DELETE_USER = '[Settings] To Delete User'
export const CANCEL_DELETE_USER = '[Settings] Cancel Delete User'
export const ENSURE_DELETE_USER = '[Settings] Ensure Delete User'
export const DELETE_USER_SUCCESS = '[Settings] Delete User Success'
export const DELETE_USER_FAILURE = '[Settings] Delete User Failure'

export const TO_ADD_USER = '[Settings] To Add User'
export const CANCEL_ADD_USER = '[Settings] Cancel Add User'
export const ENSURE_ADD_USER = '[Settings] Ensure Add User'
export const ADD_USER_SUCCESS = '[Settings] Add User Success'
export const ADD_USER_FAILURE = '[Settings] Add User Failure'
export const FETCH_SMS_CODE = '[Settings] Fetch Sms Code'
export const FETCH_SMS_CODE_SUCCESS = '[Settings] Fetch Sms Code Success'
export const FETCH_SMS_CODE_FAILURE = '[Settings] Fetch Sms Code Failure'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class FetchAllUserAction implements Action {
  readonly type = FETCH_ALL_USER
}

export class FetchAllUserSuccessAction implements Action {
  readonly type = FETCH_ALL_USER_SUCCESS
  constructor(public users: User[]) {}
}

export class FetchAllUserFailureAction implements Action {
  readonly type = FETCH_ALL_USER_FAILURE
  constructor(public users: User[]) {}
}



export class ToDeleteUserAction implements Action {
  readonly type = TO_DELETE_USER
  constructor(public id: string) {}
}

export class CancelDeleteUserAction implements Action {
  readonly type = CANCEL_DELETE_USER
}

export class EnsureDeleteUserAction implements Action {
  readonly type = ENSURE_DELETE_USER
  constructor(public id: string) {}
}

export class DeleteUserSuccessAction implements Action {
  readonly type = DELETE_USER_SUCCESS
}

export class DeleteUserFailureAction implements Action {
  readonly type = DELETE_USER_FAILURE
}


export class ToAddUserAction implements Action {
  readonly type = TO_ADD_USER
}

export class CancelAddUserAction implements Action {
  readonly type = CANCEL_ADD_USER
}

export class FetchSMSCodeAction implements Action {
  readonly type = FETCH_SMS_CODE
  constructor(public phone: string) {}
}

export class FetchSMSCodeSuccessAction implements Action {
  readonly type = FETCH_SMS_CODE_SUCCESS
}

export class FetchSMSCodeFailureAction implements Action {
  readonly type = FETCH_SMS_CODE_FAILURE
  constructor(public errorMsg: string) {}
}

export class EnsureAddUserAction implements Action {
  readonly type = ENSURE_ADD_USER
  constructor(public payload: {name: string, phone: string, code: string}) {}
}

export class AddUserSuccessAction implements Action {
  readonly type = ADD_USER_SUCCESS
}

export class AddUserFailureAction implements Action {
  readonly type = ADD_USER_FAILURE
}





/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = 
FetchAllUserAction |
FetchAllUserSuccessAction |
FetchAllUserFailureAction |

ToDeleteUserAction |
CancelDeleteUserAction |
EnsureDeleteUserAction |
DeleteUserSuccessAction |
DeleteUserFailureAction |

ToAddUserAction |
CancelAddUserAction |
EnsureAddUserAction |
AddUserSuccessAction |
AddUserFailureAction |
FetchSMSCodeAction |
FetchSMSCodeSuccessAction |
FetchSMSCodeFailureAction
