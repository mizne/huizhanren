import * as sms from '../actions/sms.action'
import { SmsTemplate } from '../models/sms.model'

export interface State {
  templates: SmsTemplate[]
}

export const initialState: State = {
  templates: []
}

export function reducer(
  state: State = initialState,
  action: sms.Actions
): State {
  switch (action.type) {
    case sms.FETCH_ALL_TEMPLATE_SUCCESS:
      return {
        ...state,
        templates: action.payload
      }

    
    default: {
      return state
    }
  }
}

export const getSmsTemplates = (state: State) => state.templates