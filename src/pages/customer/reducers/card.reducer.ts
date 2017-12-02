import {
  CustomField,
  createFields1,
  createFields2,
  createFieldsFromCustomer,
  createFieldsFromCardResp
} from '../models/card.model'

import * as fromCustomer from '../actions/customer.action'
import * as fromCard from '../actions/card.action'

type Action = fromCustomer.Actions | fromCard.Actions

export interface State {
  fields1: CustomField[]
  fields2: CustomField[]
  cardImg: string
  cardBehindImg: string
}

export const initialState: State = {
  fields1: createFields1(),
  fields2: createFields2(),
  cardImg: '',
  cardBehindImg: ''
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case fromCustomer.TO_LISTABLE_STATUS:
      return {
        ...state,
        fields1: createFields1(),
        fields2: createFields2()
      }

    case fromCard.INITIAL_EDIT_CARD:
      return {
        ...state,
        cardImg: action.customer.imageUrl,
        cardBehindImg: action.customer.imageBehindUrl,
        ...createFieldsFromCustomer(action.customer)
      }

    case fromCard.PARSE_CARD_SUCCESS:
      return {
        ...state,
        cardImg: action.cardResp.cardImg,
        cardBehindImg: '',
        ...createFieldsFromCardResp(action.cardResp.cardInfo)
      }

    case fromCard.TAKE_BEHIND_IMG_SUCCESS:
      return {
        ...state,
        cardBehindImg: action.behindImg
      }

    default:
      return state
  }
}

export const getFields1 = (state: State) => state.fields1
export const getFields2 = (state: State) => state.fields2
export const getCardImg = (state: State) => state.cardImg
export const getCardBehindImg = (state: State) => state.cardBehindImg
export const getCardInfo = (state: State) => state
