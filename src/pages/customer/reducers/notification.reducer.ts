import * as notification from '../actions/notification.action'
import { Notification } from '../models/notification.model'

export interface State {
  notifications: Notification[]
}

export const initialState: State = {
  notifications: []
}

export function reducer(
  state: State = initialState,
  action: notification.Actions
): State {
  switch (action.type) {
    case notification.FETCH_NOTIFICATION_SUCCESS:
      return {
        notifications: action.notifications
      }
    default: {
      return state
    }
  }
}

export const getNotifications = (state: State) => state.notifications