import * as fromMatcher from '../actions/matcher.action'
import { ExhibitorMatcher } from '../models/matcher.model'

export interface State {
  matchers: ExhibitorMatcher[],
  matcherTotalCount: number
  currentMatcherCount: number
}

export const initialState: State = {
  matchers: [],
  matcherTotalCount: 0,
  currentMatcherCount: 0
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
        currentMatcherCount: action.matchers.length
      }
    case fromMatcher.FETCH_MATCHERS_COUNT_SUCCESS:
      return {
        ...state,
        matcherTotalCount: action.count
      }
    case fromMatcher.FETCH_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: [],
        currentMatcherCount: 0
      }

    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: state.matchers.concat(action.matchers),
        currentMatcherCount: state.currentMatcherCount + action.matchers.length
      }

    default: {
      return state
    }
  }
}

export const getMatchers = (state: State) => state.matchers
export const getMatcherTotalCount = (state: State) => state.matcherTotalCount
export const getCurrentMatcherCount = (state: State) => state.currentMatcherCount
export const getShowLoadMore = (state: State) =>
state.matcherTotalCount > state.currentMatcherCount || state.matchers.length === 0
