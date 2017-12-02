import { Action } from '@ngrx/store'

import { Group } from '../models/group.model'

export const TO_CREATE = '[Group] To Create'
export const CANCEL_CREATE = '[Group] Cancel Create'
export const CREATE = '[Group] Create'
export const CREATE_SUCCESS = '[Group] Create Success'
export const CREATE_FAILURE = '[Group] Create Failure'

export const FETCH_ALL = '[Group] Fetch All'
export const FETCH_ALL_SUCCESS = '[Group] Fetch All Success'
export const FETCH_ALL_FAILURE = '[Group] Fetch All Failure'

export const TO_SET_GROUP = '[Group] To Set Group'
export const CANCEL_SELECT_CUSTOMER = '[Group] Cancel Select Customer'

export const TOGGLE_ACTIVE_GROUP = '[Group] Toggle Active'
export const TOGGLE_SELECT_GROUP = '[Group] Toggle Select'

export const TO_RENAME_GROUP = '[Group] To Rename Group'
export const CANCEL_RENAME_GROUP = '[Group] Cancel Rename Group'
export const ENSURE_RENAME_GROUP = '[Group] Ensure Rename Group'
export const RENAME_GROUP_SUCCESS = '[Group] Rename Group Success'
export const RENAME_GROUP_FAILURE = '[Group] Rename Group Failure'

export const TO_DELETE_GROUP = '[Group] To Delete Group'
export const CANCEL_DELETE_GROUP = '[Group] Cancel Delete Group'
export const ENSURE_DELETE_GROUP = '[Group] Ensure Delete Group'
export const DELETE_GROUP_SUCCESS = '[Group] Delete Group Success'
export const DELETE_GROUP_FAILURE = '[Group] Delete Group Failure'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ToCreateAction implements Action {
  readonly type = TO_CREATE
}

export class CancelCreateAction implements Action {
  readonly type = CANCEL_CREATE
}

export class CreateAction implements Action {
  readonly type = CREATE
  constructor(public groupName: string) {}
}

export class CreateSuccessAction implements Action {
  readonly type = CREATE_SUCCESS
}

export class CreateFailureAction implements Action {
  readonly type = CREATE_FAILURE
}



export class FetchAllAction implements Action {
  readonly type = FETCH_ALL
}

export class FetchAllSuccessAction implements Action {
  readonly type = FETCH_ALL_SUCCESS
  constructor(public groups: Group[]) {}
}

export class FetchAllFailureAction implements Action {
  readonly type = FETCH_ALL_FAILURE
}



export class ToSetGroupAction implements Action {
  readonly type = TO_SET_GROUP
}

export class CancelSelectCustomerAction implements Action {
  readonly type = CANCEL_SELECT_CUSTOMER
  constructor(public id: string) {}
}



export class ToggleActiveGroupAction implements Action {
  readonly type = TOGGLE_ACTIVE_GROUP
  constructor(public groupId: string) {}
}

export class ToggleSelectGroupAction implements Action {
  readonly type = TOGGLE_SELECT_GROUP
  constructor(public groupId: string) {}
}



export class ToRenameGroupAction implements Action {
  readonly type = TO_RENAME_GROUP
  constructor(public group: Group) {}
}

export class CancelRenameGroupAction implements Action {
  readonly type = CANCEL_RENAME_GROUP
}

export class EnsureRenameGroupAction implements Action {
  readonly type = ENSURE_RENAME_GROUP
  constructor(public group: Group) {}
}

export class RenameGroupSuccessAction implements Action {
  readonly type = RENAME_GROUP_SUCCESS
}

export class RenameGroupFailureAction implements Action {
  readonly type = RENAME_GROUP_FAILURE
}



export class ToDeleteGroupAction implements Action {
  readonly type = TO_DELETE_GROUP
  constructor(public group: Group) {}
}

export class CancelDeleteGroupAction implements Action {
  readonly type = CANCEL_DELETE_GROUP
}

export class EnsureDeleteGroupAction implements Action {
  readonly type = ENSURE_DELETE_GROUP
  constructor(public groupId: string) {}
}

export class DeleteGroupSuccessAction implements Action {
  readonly type = DELETE_GROUP_SUCCESS
}

export class DeleteGroupFailureAction implements Action {
  readonly type = DELETE_GROUP_FAILURE
}


/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions = 
ToCreateAction |
CancelCreateAction |
CreateAction | 
CreateSuccessAction | 
CreateFailureAction |

FetchAllAction | 
FetchAllSuccessAction |
FetchAllFailureAction |

ToSetGroupAction |
CancelSelectCustomerAction |

ToggleActiveGroupAction |
ToggleSelectGroupAction |

ToRenameGroupAction |
CancelRenameGroupAction |
EnsureRenameGroupAction |
RenameGroupSuccessAction |
RenameGroupFailureAction |

ToDeleteGroupAction |
CancelDeleteGroupAction |
EnsureDeleteGroupAction |
DeleteGroupSuccessAction |
DeleteGroupFailureAction
