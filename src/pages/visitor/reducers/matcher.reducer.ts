import * as fromMatcher from '../actions/matcher.action'
import { VisitorMatcher } from '../models/matcher.model'

import { deduplicate } from '../../customer/services/utils'

export interface State {
  matchers: VisitorMatcher[]
  totalMatcherCount: number
  currentMatcherTotalCount: number
}

export const initialState: State = {
  matchers: [],
  totalMatcherCount: 0,
  currentMatcherTotalCount: 0
}

export function reducer(
  state: State = initialState,
  action: fromMatcher.Actions
): State {
  switch (action.type) {
    case fromMatcher.FETCH_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: action.matchers,
        currentMatcherTotalCount: action.matchers.length
      }
    case fromMatcher.FETCH_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: []
      }
    case fromMatcher.FETCH_MATCHERS_COUNT_SUCCESS:
      return {
        ...state,
        totalMatcherCount: action.count
      }
    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: deduplicate(state.matchers.concat(action.matchers), e => e.id),
        currentMatcherTotalCount:
          state.currentMatcherTotalCount + action.matchers.length
      }

    default: {
      return state
    }
  }
}

export const getMatchers = (state: State) => state.matchers
export const getMatcherTotalCount = (state: State) => state.totalMatcherCount
export const getCurrentMatcherCount = (state: State) => state.currentMatcherTotalCount

export const getShowLoadMore = (state: State) =>
  state.totalMatcherCount > state.currentMatcherTotalCount
