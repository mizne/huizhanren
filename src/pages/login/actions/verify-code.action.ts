import { Action } from '@ngrx/store'

export const TO_VERIFY_CODE = '[Login] To Verify Code'
export const FETCH_CODE = '[Login] Fetch Code'
export const FETCH_CODE_SUCCESS = '[Login] Fetch Code Success'
export const FETCH_CODE_FAILURE = '[Login] Fetch Code Failure'

export const VERIFY_CODE = '[Login] Verify Code'
export const VERIFY_CODE_SUCCESS = '[Login] Verify Code Success'
export const VERIFY_CODE_FAILURE = '[Login] Verify Code Failure'
export const CANCEL_VERIFY_CODE = '[Login] Cancel Verify Code'

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ToVerifyCodeAction implements Action {
  readonly type = TO_VERIFY_CODE
  constructor(public phone: string) {}
}

export class FetchCodeAction implements Action {
  readonly type = FETCH_CODE
  constructor() {}
}

export class FetchCodeSuccessAction implements Action {
  readonly type = FETCH_CODE_SUCCESS
}

export class FetchCodeFailureAction implements Action {
  readonly type = FETCH_CODE_FAILURE
}

export class VerifyCodeAction implements Action {
  readonly type = VERIFY_CODE
  constructor(public payload: any) {}
}

export class VerifyCodeSuccessAction implements Action {
  readonly type = VERIFY_CODE_SUCCESS
  constructor(public payload: any) {}
}

export class VerifyCodeFailureAction implements Action {
  readonly type = VERIFY_CODE_FAILURE
  constructor() {}
}

export class CancelVerifyCodeAction implements Action {
  readonly type = CANCEL_VERIFY_CODE
  constructor() {}
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = 
ToVerifyCodeAction |
FetchCodeAction |
FetchCodeSuccessAction |
FetchCodeFailureAction |
VerifyCodeAction |
VerifyCodeSuccessAction |
VerifyCodeFailureAction |
CancelVerifyCodeAction 