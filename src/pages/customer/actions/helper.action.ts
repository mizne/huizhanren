import { Action } from '@ngrx/store'

export const HAS_SHOWED_HELP_OF_TOGGLE_LOG = '[helper] Has Showed Help Of Toggle Log'

export class HasShowedHlepOfToggleLogAction implements Action {
  readonly type = HAS_SHOWED_HELP_OF_TOGGLE_LOG
}

export type Actions = 
HasShowedHlepOfToggleLogAction
