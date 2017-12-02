import { Action } from '@ngrx/store'

export const CHECK_UPDATE = '[Settings] Check Update'
export const CHECK_UPDATE_SUCCESS = '[Settings] Check Update Success'
export const CHECK_UPDATE_FAILURE = '[Settings] Check Update Failure'

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class CheckUpdateAction implements Action {
  readonly type = CHECK_UPDATE
}

export class CheckUpdateSuccessAction implements Action {
  readonly type = CHECK_UPDATE_SUCCESS
  constructor(public updateText: string) {}
}

export class CheckUpdateFailureAction implements Action {
  readonly type = CHECK_UPDATE_FAILURE
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = 
CheckUpdateAction |
CheckUpdateSuccessAction |
CheckUpdateFailureAction
