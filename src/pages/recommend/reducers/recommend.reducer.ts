import * as fromRecommend from '../actions/recommend.action'
import { Recommend, ListStatus, PageStatus } from '../models/recommend.model'
import { CHANGE_PAGE_STATUS } from '../actions/recommend.action'

export interface State {
  recommends: Recommend[]
  recommendTotalCount: number

  listStatus: ListStatus // 表明 左边列表显示 推荐买家 还是 约请信息
  pageStatus: PageStatus // 表明 页面是否显示 右边展开的详细信息
  showDetailID: string // 表明 右边显示详细信息的 id
}

export const initialState: State = {
  recommends: [],
  recommendTotalCount: 0,

  listStatus: ListStatus.RECOMMEND,
  pageStatus: PageStatus.LIST,
  showDetailID: ''
}

export function reducer(
  state: State = initialState,
  action: fromRecommend.Actions
): State {
  switch (action.type) {
    case fromRecommend.FETCH_RECOMMEND_SUCCESS:
      return {
        ...state,
        recommends: action.recommends
      }
    case fromRecommend.FETCH_RECOMMEND_FAILURE:
      return {
        ...state,
        recommends: []
      }

    case fromRecommend.CHANGE_LIST_STATUS:
      return {
        ...state,
        listStatus: action.listStatus
      }

    case fromRecommend.CHANGE_PAGE_STATUS:
      return {
        ...state,
        pageStatus: action.pageStatus
      }

    case fromRecommend.TOGGLE_PAGE_STATUS:
      return {
        ...state,
        pageStatus:
          state.pageStatus === PageStatus.LIST
            ? PageStatus.DETAIL
            : PageStatus.LIST
      }

    case fromRecommend.UPDATE_DETAIL_ID:
      return {
        ...state,
        showDetailID: action.detailID
      }

    default: {
      return state
    }
  }
}

export const getRecommends = (state: State) => state.recommends
export const getRecommendTotalCount = (state: State) =>
  state.recommendTotalCount

export const getListStatus = (state: State) => state.listStatus
export const getPageStatus = (state: State) => state.pageStatus
export const getShowDetailID = (state: State) => state.showDetailID
