import * as fromMatcher from '../actions/matcher.action'
import { ExhibitorMatcher } from '../models/matcher.model'

export interface State {
  matchers: ExhibitorMatcher[],
  matcherTotalCount: number
  currentMatcherTotalCount: number
}

export const initialState: State = {
  matchers: [],
  matcherTotalCount: 0,
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
        matchers: [],
        currentMatcherTotalCount: 0
      }

    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: state.matchers.concat(action.matchers),
        currentMatcherTotalCount: state.currentMatcherTotalCount + action.matchers.length
      }

    default: {
      return state
    }
  }
}

export const getMatchers = (state: State) => state.matchers
export const getMatcherTotalCount = (state: State) => state.matcherTotalCount
export const getShowLoadMore = (state: State) => state.matcherTotalCount > state.currentMatcherTotalCount
