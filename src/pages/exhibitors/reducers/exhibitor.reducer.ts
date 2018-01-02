import * as fromExhibitor from '../actions/exhibitor.action'
import { Exhibitor, ListStatus, PageStatus } from '../models/exhibitor.model'

import { Logger } from '../../customer/models/logger.model'
import { deduplicate } from '../../customer/services/utils'

export interface State {
  exhibitors: Exhibitor[]
  exhibitorsTotalCount: number
  currentExhibitorsCount: number

  listStatus: ListStatus // 表明 左边列表显示 推荐买家 还是 约请信息
  pageStatus: PageStatus // 表明 页面是否显示 右边展开的详细信息
  showDetailID: string // 表明 右边显示详细信息的 id

  logs: Logger[]
}

export const initialState: State = {
  exhibitors: [],
  exhibitorsTotalCount: 1,
  currentExhibitorsCount: 0,

  listStatus: ListStatus.EXHIBITOR,
  pageStatus: PageStatus.LIST,
  showDetailID: '',

  logs: []
}

export function reducer(
  state: State = initialState,
  action: fromExhibitor.Actions
): State {
  switch (action.type) {
    case fromExhibitor.FETCH_EXHIBITORS_SUCCESS:
      return {
        ...state,
        exhibitors: action.exhibitors,
        currentExhibitorsCount: action.exhibitors.length
      }
    case fromExhibitor.FETCH_EXHIBITORS_FAILURE:
      return {
        ...state,
        exhibitors: []
      }

    case fromExhibitor.FETCH_EXHIBITORS_COUNT_SUCCESS:
      return {
        ...state,
        exhibitorsTotalCount: action.count
      }

    case fromExhibitor.LOAD_MORE_EXHIBITORS_SUCCESS:
      return {
        ...state,
        exhibitors: deduplicate(state.exhibitors.concat(action.exhibitors), e => e.id),
        currentExhibitorsCount: state.currentExhibitorsCount + action.exhibitors.length
      }

    case fromExhibitor.CHANGE_LIST_STATUS:
      return {
        ...state,
        listStatus: action.listStatus
      }

    case fromExhibitor.CHANGE_PAGE_STATUS:
      return {
        ...state,
        pageStatus: action.pageStatus
      }

    case fromExhibitor.TOGGLE_PAGE_STATUS:
      return {
        ...state,
        pageStatus:
          state.pageStatus === PageStatus.LIST
            ? PageStatus.DETAIL
            : PageStatus.LIST
      }

    case fromExhibitor.UPDATE_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID
      }

    case fromExhibitor.FETCH_LOGGER_SUCCESS:
      return {
        ...state,
        logs: action.logs
      }

    default: {
      return state
    }
  }
}

export const getExhibitors = (state: State) => state.exhibitors
export const getExhibitorsTotalCount = (state: State) =>
  state.exhibitorsTotalCount
export const getCurrentExhibitorCount = (state: State) => state.currentExhibitorsCount


export const getListStatus = (state: State) => state.listStatus
export const getPageStatus = (state: State) => state.pageStatus
export const getShowDetailID = (state: State) => state.showDetailID

export const getLogs = (state: State) => state.logs
export const getShowLoadMore = (state: State) =>
  state.exhibitorsTotalCount > state.currentExhibitorsCount || state.exhibitors.length === 0
