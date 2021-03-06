import * as fromCompleteMatcher from '../actions/complete-matcher.action'
import * as fromVisitor from '../actions/visitor.action'
import { VisitorMatcher } from '../models/matcher.model'

import { deduplicate } from '../../customer/services/utils'

type Actions = fromVisitor.Actions | fromCompleteMatcher.Actions

export interface State {
  matchers: VisitorMatcher[]
  totalMatcherCount: number
  currentMatcherTotalCount: number

  showDetailID: string
  shouldScrollToTop: boolean
}

export const initialState: State = {
  matchers: [],
  totalMatcherCount: 0,
  currentMatcherTotalCount: 0,

  showDetailID: '',
  shouldScrollToTop: false
}

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case fromCompleteMatcher.FETCH_COMPLETE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: action.matchers,
        currentMatcherTotalCount: action.matchers.length,
        showDetailID: '',
        shouldScrollToTop: true
      }
    case fromCompleteMatcher.FETCH_COMPLETE_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: [],
        currentMatcherTotalCount: 0
      }
    case fromCompleteMatcher.FETCH_COMPLETE_MATCHERS_COUNT_SUCCESS:
      return {
        ...state,
        totalMatcherCount: action.count
      }
    case fromCompleteMatcher.LOAD_MORE_COMPLETE_MATCHERS_SUCCESS:
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
    case fromCompleteMatcher.UPDATE_COMPLETE_MATCHER_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID,
        matchers: state.matchers.map(e => ({
          ...e,
          selected: e.id === action.detailID
        }))
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
export const getMatcherDetailID = (state: State) => state.showDetailID
export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop
export const getVisitorDetailID = (state: State) => {
  const matcher = state.matchers.find(e => e.id === state.showDetailID)
  return matcher ? matcher.toShow.id : ''
}
