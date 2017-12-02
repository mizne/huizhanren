import * as other from '../actions/other.action'

export interface State {
  updateText: string
}

export const initialState: State = {
  updateText: ''
}

export function reducer(
  state: State = initialState,
  action: other.Actions
): State {
  switch (action.type) {
    case other.CHECK_UPDATE_SUCCESS:
      return {
        ...state,
        updateText: action.updateText
      }
    default: {
      return state
    }
  }
}

export const getUpdateText = (state: State) => {
  return state.updateText
}
