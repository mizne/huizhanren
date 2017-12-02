import { Action } from '@ngrx/store'

import { CardResp } from '../models/card.model'
import { Customer } from '../models/customer.model'

export const TAKE_CAMERA = '[Card] Take Camera'
export const TAKE_CAMERA_SUCCESS = '[Card] Take Camera Success'
export const TAKE_CAMERA_FAILURE = '[Card] Take Camera Failure'

export const PARSE_CARD = '[Card] Parse Card'
export const PARSE_CARD_SUCCESS = '[Card] Parse Card Success'
export const PARSE_CARD_FAILURE = '[Card] Parse Card Failure'

export const TAKE_BEHIND_IMG_SUCCESS = '[Card] Take Behind Img Success'

export const INITIAL_EDIT_CARD = '[Card] Initial Edit Card'

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class TakeCameraAction implements Action {
  readonly type = TAKE_CAMERA
}

export class TakeCameraSuccessAction implements Action {
  readonly type = TAKE_CAMERA_SUCCESS
}

export class TakeCameraFailureAction implements Action {
  readonly type = TAKE_CAMERA_FAILURE
}



export class ParseCardAction implements Action {
  readonly type = PARSE_CARD
  constructor(public imgData: string) {}
}

export class ParseCardSuccessAction implements Action {
  readonly type = PARSE_CARD_SUCCESS
  constructor(public cardResp: CardResp) {}
}

export class ParseCardFailureAction implements Action {
  readonly type = PARSE_CARD_FAILURE
}



export class TakeBehindImgSuccessAction implements Action {
  readonly type = TAKE_BEHIND_IMG_SUCCESS
  constructor(public behindImg: string) {}
}



export class InitialEditCardAction implements Action {
  readonly type = INITIAL_EDIT_CARD
  constructor(public customer: Customer) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = 
TakeCameraAction |
TakeCameraSuccessAction |
TakeCameraFailureAction |

ParseCardAction |
ParseCardSuccessAction |
ParseCardFailureAction |

TakeBehindImgSuccessAction |

InitialEditCardAction
