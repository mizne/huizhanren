import * as fromVisitor from '../actions/visitor.action'
import {
  RecommendVisitor,
  ListStatus,
  PageStatus,
  FilterOptions
} from '../models/visitor.model'
import { Logger } from '../../customer/models/logger.model'
import { deduplicate } from '../../customer/services/utils'

export interface State {
  visitors: RecommendVisitor[]
  totalVisitorsCount: number
  currentVisitorsTotalCount: number

  areaFilters: FilterOptions[]
  typeFilters: FilterOptions[]

  listStatus: ListStatus // 表明 左边列表显示 推荐买家 还是 约请信息
  pageStatus: PageStatus // 表明 页面是否显示 右边展开的详细信息
  showDetailID: string // 表明 右边显示详细信息的 id
  shouldScrollToTop: boolean

  logs: Logger[]
}

export const initialState: State = {
  visitors: [],
  totalVisitorsCount: 0,
  currentVisitorsTotalCount: 0,

  areaFilters: [{ label: '不限区域', value: '' }],
  typeFilters: [{ label: '不限分类', value: '' }],

  listStatus: ListStatus.VISITOR,
  pageStatus: PageStatus.LIST,
  showDetailID: '',
  shouldScrollToTop: false,

  logs: []
}

export function reducer(
  state: State = initialState,
  action: fromVisitor.Actions
): State {
  switch (action.type) {
    case fromVisitor.FETCH_VISITORS_SUCCESS:
      return {
        ...state,
        visitors: action.visitors,
        showDetailID: '',
        shouldScrollToTop: true,
        currentVisitorsTotalCount: action.visitors.length
      }
    case fromVisitor.FETCH_VISITORS_FAILURE:
      return {
        ...state,
        visitors: [],
        showDetailID: ''
      }

    case fromVisitor.FETCH_VISITORS_COUNT_SUCCESS:
      return {
        ...state,
        totalVisitorsCount: action.count
      }

    case fromVisitor.LOAD_MORE_VISITORS_SUCCESS:
      return {
        ...state,
        shouldScrollToTop: false,
        visitors: deduplicate(
          state.visitors.concat(action.visitors),
          e => e.id
        ),
        currentVisitorsTotalCount:
          state.currentVisitorsTotalCount + action.visitors.length
      }

    case fromVisitor.FETCH_AREA_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        areaFilters: state.areaFilters.concat(action.areaFilters)
      }

    case fromVisitor.FETCH_TYPE_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        typeFilters: state.typeFilters.concat(action.typeFilters)
      }

    case fromVisitor.CHANGE_LIST_STATUS:
      return {
        ...state,
        listStatus: action.listStatus,
        showDetailID: ''
      }

    case fromVisitor.CHANGE_PAGE_STATUS:
      return {
        ...state,
        pageStatus: action.pageStatus
      }

    case fromVisitor.TOGGLE_PAGE_STATUS:
      return {
        ...state,
        pageStatus:
          state.pageStatus === PageStatus.LIST
            ? PageStatus.DETAIL
            : PageStatus.LIST
      }

    case fromVisitor.UPDATE_VISITOR_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID
      }

    case fromVisitor.FETCH_LOGGER_SUCCESS:
      return {
        ...state,
        logs: action.logs
      }

    default: {
      return state
    }
  }
}

export const getVisitors = (state: State) => state.visitors
export const getTotalVisitorCount = (state: State) => state.totalVisitorsCount
export const getCurrentVisitorCount = (state: State) =>
  state.currentVisitorsTotalCount

export const getAreaFilters = (state: State) => state.areaFilters
export const getTypeFilters = (state: State) => state.typeFilters

export const getShouldScrollToTop = (state: State) => state.shouldScrollToTop
export const getListStatus = (state: State) => state.listStatus
export const getPageStatus = (state: State) => state.pageStatus
export const getShowDetailID = (state: State) => state.showDetailID

export const getLogs = (state: State) => state.logs
export const getShowLoadMore = (state: State) =>
  state.totalVisitorsCount > state.currentVisitorsTotalCount
