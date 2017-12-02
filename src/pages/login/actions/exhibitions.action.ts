import { Action } from '@ngrx/store'

import { FetchExhibitionsAndLoginResp } from '../../../providers/login.service'

export const FETCH_ALL_EXHIBITIONS = '[Login] Fetch All Exhibitions'
export const FETCH_ALL_EXHIBITIONS_SUCCESS = '[Login] Fetch All Exhibitions Success'
export const FETCH_ALL_EXHIBITIONS_FAILURE = '[Login] Fetch All Exhibitions Failure'
export const TO_WELCOME = '[Login] To Welcome'
export const SELECT_EXHIBITION = '[Login] Select Exhibition'
/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class FetchAllExhibitionsAction implements Action {
  readonly type = FETCH_ALL_EXHIBITIONS
  constructor(public phone: string) {}
}

export class FetchAllExhibitionsSuccessAction implements Action {
  readonly type = FETCH_ALL_EXHIBITIONS_SUCCESS
  constructor(public payload: FetchExhibitionsAndLoginResp) {}
}

export class FetchAllExhibitionsFailureAction implements Action {
  readonly type = FETCH_ALL_EXHIBITIONS_FAILURE
  constructor() {}
}

export class ToWelcomeAction implements Action {
  readonly type = TO_WELCOME
  constructor() {}
}

export class SelectExhibitionAction implements Action {
  readonly type = SELECT_EXHIBITION
  constructor(public exhibitionId: string) {}
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
FetchAllExhibitionsAction |
FetchAllExhibitionsSuccessAction |
FetchAllExhibitionsFailureAction |
ToWelcomeAction |
SelectExhibitionAction
