import * as fromVisitor from '../actions/visitor.action'
import {
  RecommendVisitor,
  ListStatus,
  PageStatus
} from '../models/visitor.model'
import { Logger } from '../../customer/models/logger.model'

export interface State {
  visitors: RecommendVisitor[]
  totalVisitorsCount: number
  currentVisitorsTotalCount: number

  listStatus: ListStatus // 表明 左边列表显示 推荐买家 还是 约请信息
  pageStatus: PageStatus // 表明 页面是否显示 右边展开的详细信息
  showDetailID: string // 表明 右边显示详细信息的 id

  logs: Logger[]
}

export const initialState: State = {
  visitors: [],
  totalVisitorsCount: 0,
  currentVisitorsTotalCount: 0,

  listStatus: ListStatus.VISITOR,
  pageStatus: PageStatus.LIST,
  showDetailID: '',

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
        currentVisitorsTotalCount: action.visitors.length
      }
    case fromVisitor.FETCH_VISITORS_FAILURE:
      return {
        ...state,
        visitors: []
      }

    case fromVisitor.FETCH_VISITORS_COUNT_SUCCESS:
      return {
        ...state,
        totalVisitorsCount: action.count
      }

    case fromVisitor.LOAD_MORE_VISITORS_SUCCESS:
      return {
        ...state,
        visitors: state.visitors.concat(action.visitors),
        currentVisitorsTotalCount: state.currentVisitorsTotalCount + action.visitors.length
      }

    case fromVisitor.CHANGE_LIST_STATUS:
      return {
        ...state,
        listStatus: action.listStatus
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

    case fromVisitor.UPDATE_DETAIL_ID:
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
export const getCurrentVisitorCount = (state: State) => state.currentVisitorsTotalCount

export const getListStatus = (state: State) => state.listStatus
export const getPageStatus = (state: State) => state.pageStatus
export const getShowDetailID = (state: State) => state.showDetailID

export const getLogs = (state: State) => state.logs
export const getShowLoadMore = (state: State) =>
  state.totalVisitorsCount > state.currentVisitorsTotalCount || state.visitors.length === 0
