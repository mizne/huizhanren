

import * as fromCustomer from '../actions/customer.action'
import * as fromHelper from '../actions/helper.action'

type Action = fromCustomer.Actions | fromHelper.Actions

export interface State {
  hasShowHelpOfToggleLog: boolean
  needShowHelpOfToggleLog: boolean
}

export const initialState: State = {
  hasShowHelpOfToggleLog: false,
  needShowHelpOfToggleLog: false
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case fromCustomer.TO_DETAILABLE_STATUS:
      return {
        ...state,
        needShowHelpOfToggleLog: !state.hasShowHelpOfToggleLog
      }

    case fromHelper.HAS_SHOWED_HELP_OF_TOGGLE_LOG:
      return {
        ...state,
        hasShowHelpOfToggleLog: true,
        needShowHelpOfToggleLog: false
      }

    default:
      return state
  }
}

export const needShowHelpOfToggleLog = (state: State) => state.needShowHelpOfToggleLog

