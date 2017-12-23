import * as customer from '../actions/customer.action'
import * as sms from '../actions/sms.action'
import * as group from '../actions/group.action'

import { remain, phoneRe } from '../services/utils'

import {
  Customer,
} from '../models/customer.model'
import { Group } from '../models/group.model'

type Action = customer.Actions | sms.Actions | group.Actions

export type CustomerPateStatus =
  | 'listable'
  | 'editable'
  | 'detailable'
  | 'manageable'
  | 'createable'
export type CustomerPageManageableStatus = 'sms' | 'group'


export interface State {
  customers: Customer[]
  groups: Group[]
  loading: boolean
  pageStatus: CustomerPateStatus
  manageableStatus: CustomerPageManageableStatus
  showDetailCustomerId: string
  showDetailGroupId: string
  showLog: boolean
  showNotification: boolean
}

export const initialState: State = {
  customers: [],
  groups: [],
  loading: false,
  pageStatus: 'listable',
  manageableStatus: 'sms',
  showDetailCustomerId: '',
  showDetailGroupId: '',
  showLog: false,
  showNotification: false,
}

export function reducer(
  state: State = initialState,
  action: Action
): State {
  switch (action.type) {
    case customer.ENSURE_GROUP_SCROLL_TOP:
      return {
        ...state,
        groups: state.groups.map((e) => {
          if (e.id === action.payload.groupId) {
            return {
              ...e,
              scrollTop: action.payload.scrollTop
            }
          } else {
            return e
          }
        })
      }
    case customer.TOGGLE_SHOW_LOG:
      return {
        ...state,
        showLog: action.flag ? true : !state.showLog,
        showNotification: false
      }

    case customer.TOGGLE_SHOW_NOTIFICATION:
      return {
        ...state,
        showLog: false,
        showNotification: action.flag ? true : !state.showNotification
      }

    case group.TOGGLE_ACTIVE_GROUP:
      return {
        ...state,
        groups: state.groups.map(e => {
          if (e.id === action.groupId) {
            return {
              ...e,
              active: !e.active
            }
          }
          return e
        })
      }

    case group.TOGGLE_SELECT_GROUP:
      const newGroups = state.groups.map(e => {
        if (e.id === action.groupId) {
          return {
            ...e,
            selected: !e.selected
          }
        }
        return e
      })
      return {
        ...state,
        groups: newGroups,
        customers: state.customers.map(customer => {
          const selectedGroups = newGroups.filter(e => e.selected)

          if (customer.groups.length === 0) {
            return {
              ...customer,
              selected: !!selectedGroups.find(e => e.id === '无标签')
            }
          }

          // 如果customer中某一个group被选中 则customer被选中
          if (selectedGroups.find(e => customer.groups.indexOf(e.id) >= 0)) {
            return {
              ...customer,
              selected: true
            }
          } else {
            return customer
          }
        })
      }

    case group.FETCH_ALL_SUCCESS:
      return {
        ...state,
        groups: remain(state.groups, action.groups, ['active', 'selected'])
      }

    case customer.FETCH_ALL_SUCCESS:
      return {
        ...state,
        customers: remain(state.customers, action.customers, ['selected'])
      }

    case customer.INITIAL_SUCCESS:
      return {
        ...state,
        customers: remain(state.customers, action.payload.customers, ['selected']),
        groups: remain(state.groups, action.payload.groups, ['active', 'selected'])
      }

    case customer.TO_EDITABLE_STATUS:
      return {
        ...state,
        pageStatus: 'editable',
      }

    case customer.TO_CREATEABLE_STATUS:
      return {
        ...state,
        pageStatus: 'createable'
      }

    case customer.TO_DETAILABLE_STATUS:
      return {
        ...state,
        pageStatus: 'detailable',
        showDetailCustomerId: action.payload.customerId,
        showDetailGroupId: action.payload.groupId
      }

    case customer.TO_MANAGEABLE_STATUS:
      return {
        ...state,
        pageStatus: 'manageable'
      }

    case customer.TO_LISTABLE_STATUS:
      return {
        ...state,
        pageStatus: 'listable',
      }

    case sms.TO_SEND_SMS_PAGE:
      return {
        ...state,
        pageStatus: 'manageable',
        manageableStatus: 'sms'
      }

    case group.TO_SET_GROUP:
      return {
        ...state,
        pageStatus: 'manageable',
        manageableStatus: 'group'
      }

    case customer.SELECT_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((e) => {
          if (e.id === action.id) {
            return {
              ...e,
              selected: true
            }
          }
          return e
        })
      }

    case customer.CANCEL_SELECT_CUSTOMER:
    case group.CANCEL_SELECT_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map((e) => {
          if (e.id === action.id) {
            return {
              ...e,
              selected: false
            }
          }
          return e
        })
      }

    case sms.SELECT_PHONE:
      return {
        ...state,
        customers: state.customers.map((customer) => {
          if (customer.id === action.payload.id) {
            return {
              ...customer,
              phones: customer.phones.map(p => {
                if (p.value === action.payload.phone) {
                  return {
                    ...p,
                    selected: true
                  }
                }
                return p
              })
            }
          }
          return customer
        })
      }

      case sms.CANCEL_SELECT_PHONE:
        return {
          ...state,
          customers: state.customers.map((customer) => {
            if (customer.id === action.payload.id) {
              return {
                ...customer,
                phones: customer.phones.map(p => {
                  if (p.value === action.payload.phone) {
                    return {
                      ...p,
                      selected: false
                    }
                  }
                  return p
                })
              }
            }
            return customer
          })
        }

      case sms.SELECT_ALL_PHONE:
        return {
          ...state,
          customers: state.customers.map((customer) => {
            if (customer.selected) {
              return {
                ...customer,
                phones: customer.phones.map(e => ({
                  label: e.label,
                  value: e.value,
                  selected: true
                }))
              }
            }
            return customer
          })
        }

      case sms.CANCEL_SELECT_ALL_PHONE:
        return {
          ...state,
          customers: state.customers.map((customer) => {
            if (customer.selected) {
              return {
                ...customer,
                phones: customer.phones.map(e => ({
                  label: e.label,
                  value: e.value,
                  selected: false
                }))
              }
            }
            return customer
          })
        }

    default: {
      return state
    }
  }
}

export const getCustomers = (state: State) => {
  return state.customers
}
export const getCustomerPageStatus = (state: State) => state.pageStatus
export const getGroups = (state: State) => state.groups
export const getManageableStatus = (state: State) => state.manageableStatus
export const getSelectedCustomers = (state: State) =>
  state.customers.filter(e => e.selected)

export const getPhonesToSendOfCustomers = (state: State) => {
  return state.customers
    .filter(e => e.selected)
    .map(e => ({
      customerId: e.id,
      customerName: e.name,
      phones: e.phones.filter(e => {
        return e.selected && phoneRe.test(e.value)
      }).map(e => e.value)
    }))
}

export const getShowDetailCustomerId = (state: State) => state.showDetailCustomerId
export const getShowDetailGroupId = (state: State) => state.showDetailGroupId
export const getShowLog = (state: State) => state.showLog
export const getShowNotification = (state: State) => state.showNotification
