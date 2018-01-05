import * as fromMatcher from '../actions/matcher.action'
import * as fromExhibitor from '../actions/exhibitor.action'
import { ExhibitorMatcher } from '../models/matcher.model'

import { deduplicate } from '../../customer/services/utils'

type Actions = fromMatcher.Actions | fromExhibitor.Actions

export interface State {
  matchers: ExhibitorMatcher[]
  matcherTotalCount: number
  currentMatcherCount: number

  showDetailID: string
  shouldScrollToTop: boolean
}

export const initialState: State = {
  matchers: [],
  matcherTotalCount: 0,
  currentMatcherCount: 0,

  showDetailID: '',
  shouldScrollToTop: false
}

export function reducer(state: State = initialState, action: Actions): State {
  switch (action.type) {
    case fromMatcher.FETCH_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: action.matchers,
        currentMatcherCount: action.matchers.length,
        showDetailID: '',
        shouldScrollToTop: true
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
        currentMatcherCount: 0,
        showDetailID: ''
      }

    case fromMatcher.LOAD_MORE_MATCHERS_SUCCESS:
      return {
        ...state,
        matchers: deduplicate(
          state.matchers.concat(action.matchers),
          e => e.id
        ),
        currentMatcherCount: state.currentMatcherCount + action.matchers.length
      }

    case fromMatcher.UPDATE_MATCHER_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID
      }
    case fromExhibitor.CHANGE_LIST_STATUS:
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
export const getMatcherTotalCount = (state: State) => state.matcherTotalCount
export const getCurrentMatcherCount = (state: State) =>
  state.currentMatcherCount
export const getShowLoadMore = (state: State) =>
  state.matcherTotalCount > state.currentMatcherCount
export const getShowDetailID = (state: State) => state.showDetailID
export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop
