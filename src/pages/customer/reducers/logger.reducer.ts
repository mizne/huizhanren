import * as logger from '../actions/logger.action'
import { ContactLogger } from '../models/logger.model'

export interface State {
  logs: ContactLogger[]
}

export const initialState: State = {
  logs: []
}

export function reducer(
  state: State = initialState,
  action: logger.Actions
): State {
  switch (action.type) {
    case logger.FETCH_LOGGER_SUCCESS:
      return {
        logs: action.logs
      }
    default: {
      return state
    }
  }
}

export const getLogs = (state: State) => state.logs