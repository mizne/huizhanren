import * as fromMatcher from '../actions/matcher.action'
import * as fromVisitor from '../actions/visitor.action'
import { VisitorMatcher } from '../models/matcher.model'

import { deduplicate } from '../../customer/services/utils'

type Actions = fromVisitor.Actions | fromMatcher.Actions

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
    case fromMatcher.FETCH_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: action.matchers,
        currentMatcherTotalCount: action.matchers.length,
        showDetailID: '',
        shouldScrollToTop: true
      }
    case fromMatcher.FETCH_MATCHERS_FAILURE:
      return {
        ...state,
        matchers: [],
        currentMatcherTotalCount: 0,
        showDetailID: ''
      }
    case fromMatcher.FETCH_MATCHERS_COUNT_SUCCESS:
      return {
        ...state,
        totalMatcherCount: action.count
      }
    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
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

    case fromMatcher.UPDATE_MATCHER_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID
      }
    case fromVisitor.CHANGE_LIST_STATUS:
      return {
        ...state,
        showDetailID: ''
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
export const getShowDetailID = (state: State) => state.showDetailID
export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop
