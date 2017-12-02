import * as fromApp from './app.action'

import { LoginPage } from '../pages/login/login'
import { TabsPage } from '../pages/tabs/tabs'

export interface State {
  rootPage: any
}

const initialState: State = {
  rootPage: null
}

export function reducer(
  state: State = initialState,
  action: fromApp.Actions
): State {
  switch (action.type) {
    case fromApp.TO_LOGIN_PAGE:
      return {
        rootPage: LoginPage
      }

    case fromApp.TO_TABS_PAGE:
      return {
        rootPage: TabsPage
      }

    default:
      return state
  }
}

export const getRootPage = (state: State) => state.rootPage
