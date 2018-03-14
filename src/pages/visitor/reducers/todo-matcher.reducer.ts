import * as fromToDoMatcher from '../actions/todo-matcher.action'
import * as fromVisitor from '../actions/visitor.action'
import { VisitorMatcher } from '../models/matcher.model'

import { deduplicate } from '../../customer/services/utils'

type Actions = fromVisitor.Actions | fromToDoMatcher.Actions

export interface State {
  matchers: VisitorMatcher[]
  totalMatcherCount: number
  currentMatcherTotalCount: number
  shouldScrollToTop: boolean
}

export const initialState: State = {
  matchers: [],
  totalMatcherCount: 0,
  currentMatcherTotalCount: 0,
  shouldScrollToTop: false
}

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case fromToDoMatcher.FETCH_TODO_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: action.matchers,
        currentMatcherTotalCount: action.matchers.length,
        shouldScrollToTop: true
      }
    case fromToDoMatcher.FETCH_TODO_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: [],
        currentMatcherTotalCount: 0,
      }
    case fromToDoMatcher.FETCH_TODO_MATCHERS_COUNT_SUCCESS:
      return {
        ...state,
        totalMatcherCount: action.count
      }
    case fromToDoMatcher.LOAD_MORE_TODO_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: deduplicate(
          state.matchers.concat(action.matchers),
          e => e.id
        ),
        currentMatcherTotalCount:
          state.currentMatcherTotalCount + action.matchers.length,
        shouldScrollToTop: false
      }

    default: {
      return state
    }
  }
}

export const getMatchers = (state: State) => state.matchers
export const getMatcherTotalCount = (state: State) => state.totalMatcherCount
export const getCurrentMatcherCount = (state: State) =>
  state.currentMatcherTotalCount

export const getShowLoadMore = (state: State) =>
  state.totalMatcherCount > state.currentMatcherTotalCount
export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop
