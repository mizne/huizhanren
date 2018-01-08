import * as fromExhibitor from '../actions/exhibitor.action'
import { Exhibitor, ListStatus, PageStatus, FilterOptions } from '../models/exhibitor.model'

import { Logger } from '../../customer/models/logger.model'
import { deduplicate } from '../../customer/services/utils'

export interface State {
  exhibitors: Exhibitor[]
  exhibitorsTotalCount: number
  currentExhibitorsCount: number

  areaFilters: FilterOptions[]
  typeFilters: FilterOptions[]

  listStatus: ListStatus // 表明 左边列表显示 推荐买家 还是 约请信息
  pageStatus: PageStatus // 表明 页面是否显示 右边展开的详细信息
  showDetailID: string // 表明 右边显示详细信息的 id
  shouldScrollToTop: boolean
  logs: Logger[]
}

export const initialState: State = {
  exhibitors: [],
  exhibitorsTotalCount: 0,
  currentExhibitorsCount: 0,

  areaFilters: [{label: '不限区域', value: '0'}],
  typeFilters: [],

  listStatus: ListStatus.EXHIBITOR,
  pageStatus: PageStatus.LIST,
  showDetailID: '',
  shouldScrollToTop: false,

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
        currentExhibitorsCount: action.exhibitors.length,
        showDetailID: '',
        shouldScrollToTop:  true
      }
    case fromExhibitor.FETCH_EXHIBITORS_FAILURE:
      return {
        ...state,
        exhibitors: [],
        showDetailID: ''
      }

    case fromExhibitor.FETCH_EXHIBITORS_COUNT_SUCCESS:
      return {
        ...state,
        exhibitorsTotalCount: action.count - 1 // 当前由于 前台显示展商列表需要过滤登录展商 故总数也-1
      }

    case fromExhibitor.LOAD_MORE_EXHIBITORS_SUCCESS:
      return {
        ...state,
        exhibitors: deduplicate(
          state.exhibitors.concat(action.exhibitors),
          e => e.id
        ),
        currentExhibitorsCount:
          state.currentExhibitorsCount + action.exhibitors.length,
          shouldScrollToTop: false
      }

    case fromExhibitor.FETCH_AREA_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        areaFilters: state.areaFilters.concat(action.areaFilters)
      }

    case fromExhibitor.FETCH_TYPE_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        typeFilters: state.typeFilters.concat(action.typeFilters)
      }

    case fromExhibitor.CHANGE_LIST_STATUS:
      return {
        ...state,
        listStatus: action.listStatus,
        showDetailID: ''
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

    case fromExhibitor.UPDATE_EXHIBITOR_DETAIL_ID:
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
export const getCurrentExhibitorCount = (state: State) =>
  state.currentExhibitorsCount
export const getAreaFilters = (state: State) => state.areaFilters
export const getTypeFilters = (state: State) => state.typeFilters

export const getListStatus = (state: State) => state.listStatus
export const getPageStatus = (state: State) => state.pageStatus
export const getShowDetailID = (state: State) => state.showDetailID
export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop

export const getLogs = (state: State) => state.logs
export const getShowLoadMore = (state: State) =>
  state.exhibitorsTotalCount > state.currentExhibitorsCount
