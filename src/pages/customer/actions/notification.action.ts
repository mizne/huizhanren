import { Action } from '@ngrx/store'
import { Notification } from '../models/notification.model'

export const TO_CREATE_NOTIFICATION = '[Notification] To Create Notification'
export const CANCEL_CREATE_NOTIFICATION = '[Notification] Cancel Create Notification'
export const CREATE_NOTIFICATION = '[Notification] Create Notification'
export const CREATE_NOTIFICATION_SUCCESS = '[Notification] Create Notification Success'
export const CREATE_NOTIFICATION_FAILURE = '[Notification] Create Notification Failure'

export const TO_EDIT_NOTIFICATION = '[Notification] To Edit Notification'
export const CANCEL_EDIT_NOTIFICATION = '[Notification] Cancel Edit Notification'
export const EDIT_NOTIFICATION = '[Notification] Edit Notification'
export const EDIT_NOTIFICATION_SUCCESS = '[Notification] Edit Notification Success'
export const EDIT_NOTIFICATION_FAILURE = '[Notification] Edit Notification Failure'

export const FETCH_NOTIFICATION = '[Notification] Fetch Notification'
export const FETCH_NOTIFICATION_SUCCESS = '[Notification] Fetch Notification Success'
export const FETCH_NOTIFICATION_FAILURE = '[Notification] Fetch Notification Failure'

export class ToCreateNotificationAction implements Action {
  readonly type = TO_CREATE_NOTIFICATION
}

export class CancelCreateNotificationAction implements Action {
  readonly type = CANCEL_CREATE_NOTIFICATION
}

export class CreateNotificationAction implements Action {
  readonly type = CREATE_NOTIFICATION
  constructor(public notification: Notification) {}
}

export class CreateNotificationSuccessAction implements Action {
  readonly type = CREATE_NOTIFICATION_SUCCESS
}

export class CreateNotificationFailureAction implements Action {
  readonly type = CREATE_NOTIFICATION_FAILURE
}



export class ToEditNotificationAction implements Action {
  readonly type = TO_EDIT_NOTIFICATION
  constructor(public notification: Notification) {}
}

export class CancelEditNotificationAction implements Action {
  readonly type = CANCEL_EDIT_NOTIFICATION
}

export class EditNotificationAction implements Action {
  readonly type = EDIT_NOTIFICATION
  constructor(public notification: Notification) {}
}

export class EditNotificationSuccessAction implements Action {
  readonly type = EDIT_NOTIFICATION_SUCCESS
}

export class EditNotificationFailureAction implements Action {
  readonly type = EDIT_NOTIFICATION_FAILURE
}






export class FetchNotificationAction implements Action {
  readonly type = FETCH_NOTIFICATION

  constructor(public customerId?: string) {}
}

export class FetchNotificationSuccessAction implements Action {
  readonly type = FETCH_NOTIFICATION_SUCCESS
  constructor(public notifications: Notification[]) {}
}

export class FetchNotificationFailureAction implements Action {
  readonly type = FETCH_NOTIFICATION_FAILURE
}

export type Actions = 
ToCreateNotificationAction |
CancelCreateNotificationAction | 
CreateNotificationAction |
CreateNotificationSuccessAction |
CreateNotificationFailureAction | 

ToEditNotificationAction |
CancelEditNotificationAction |
EditNotificationAction |
EditNotificationSuccessAction |
EditNotificationFailureAction |

FetchNotificationAction | 
FetchNotificationSuccessAction | 
FetchNotificationFailureAction
