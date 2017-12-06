import * as fromMatcher from '../actions/matcher.action'
import { ExhibitorMatcher } from '../models/matcher.model'

export interface State {
  matchers: ExhibitorMatcher[],
  matcherTotalCount: number
  currentTotalCount: number
}

export const initialState: State = {
  matchers: [],
  matcherTotalCount: 0,
  currentTotalCount: 0
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
        currentTotalCount: action.matchers.length
      }
    case fromMatcher.FETCH_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: [],
        currentTotalCount: 0
      }

    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: state.matchers.concat(action.matchers),
        currentTotalCount: state.currentTotalCount + action.matchers.length
      }

    default: {
      return state
    }
  }
}

export const getMatchers = (state: State) => state.matchers
export const getMatcherTotalCount = (state: State) => state.matcherTotalCount
