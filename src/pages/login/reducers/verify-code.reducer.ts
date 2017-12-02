import { Actions, TO_VERIFY_CODE, VERIFY_CODE, VERIFY_CODE_SUCCESS } from '../actions/verify-code.action'

export interface State {
  phone: string
  code: string
}

export const initialState: State = {
  phone: '',
  code: ''
}

export function reducer(
  state: State = initialState,
  action: Actions
): State {
  switch (action.type) {
    case TO_VERIFY_CODE:
      return {
        phone: action.phone,
        code: ''
      }
    case VERIFY_CODE:
    case VERIFY_CODE_SUCCESS:
      return {
        ...action.payload
      }
    default: {
      return state
    }
  }
}

export const getPhone = (state: State) => state.phone
export const getCode = (state: State) => state.code