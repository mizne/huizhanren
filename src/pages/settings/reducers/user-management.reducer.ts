import * as userManagement from '../actions/user-management.action'
import { User } from '../models/user.model'

export interface State {
  users: User[],
  maxUserCount: number
}

export const initialState: State = {
  users: [],
  maxUserCount: 5
}

export function reducer(
  state: State = initialState,
  action: userManagement.Actions
): State {
  switch (action.type) {
    case userManagement.FETCH_ALL_USER_SUCCESS:
      return {
        ...state,
        users: action.users
      }

    
    default: {
      return state
    }
  }
}

export const getUsers = (state: State) => state.users
export const getMaxUserCount = (state: State) => state.maxUserCount