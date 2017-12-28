import {
  Actions,
  FETCH_ALL_EXHIBITIONS_SUCCESS,
  SELECT_EXHIBITION
 } from '../actions/exhibitions.action'

 import { Exhibition } from '../models/exhibition.model'

export interface State {
  adminName: string
  userName: string
  tenantId: string
  userId: string
  companyName: string
  exhibitions: Exhibition[]
  selectedExhibitionId: string
  boothNo: string
  exhibitorId: string
}

export const initialState: State = {
  adminName: '',
  userName: '',
  tenantId: '',
  userId: '',
  companyName: '',
  exhibitions: [],
  selectedExhibitionId: '',
  boothNo: '', // 参展的展台位置
  exhibitorId: ''
}

export function reducer(
  state: State = initialState,
  action: Actions
): State {
  switch (action.type) {
    case FETCH_ALL_EXHIBITIONS_SUCCESS:
      return {
        ...state,
        ...action.payload
      }

    case SELECT_EXHIBITION:
      return {
        ...state,
        selectedExhibitionId: action.exhibitionId,
      }
    default: {
      return state
    }
  }
}

export const getAdminName = (state: State) => state.adminName
export const getUserName = (state: State) => state.userName
export const isAdmin = (state: State) => state.adminName === state.userName
export const getCompanyName = (state: State) => state.companyName
export const getExhibitions = (state: State) => state.exhibitions
export const getSelectedExhibitionId = (state: State) => state.selectedExhibitionId
export const getBoothNo = (state: State) => state.boothNo

export const getTenantId = (state: State) => state.tenantId
export const getUserId = (state: State) => state.userId
export const getExhibitorId = (state: State) => state.exhibitorId
