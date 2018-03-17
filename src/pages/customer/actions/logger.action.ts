import { Action } from '@ngrx/store'
import { ContactLogger, ContactLoggerLevel } from '../models/logger.model'

export const TO_CREATE_LOGGER = '[Logger] To Create Logger'
export const CANCEL_CREATE_LOGGER = '[Logger] Cancel Create Logger'
export const CREATE_LOGGER = '[Logger] Create Logger'
export const CREATE_LOGGER_SUCCESS = '[Logger] Create Logger Success'
export const CREATE_LOGGER_FAILURE = '[Logger] Create Logger Failure'

export const TO_EDIT_LOGGER = '[Logger] To Edit Logger'
export const CANCEL_EDIT_LOGGER = '[Logger] Cancel Edit Logger'
export const EDIT_LOGGER = '[Logger] Edit Logger'
export const EDIT_LOGGER_SUCCESS = '[Logger] Edit Logger Success'
export const EDIT_LOGGER_FAILURE = '[Logger] Edit Logger Failure'

export const FETCH_LOGGER = '[Logger] Fetch Logger'
export const FETCH_LOGGER_SUCCESS = '[Logger] Fetch Logger Success'
export const FETCH_LOGGER_FAILURE = '[Logger] Fetch Logger Failure'

export const BATCH_CREATE_LOGGER = '[Logger] Batch Create Logger'
export const BATCH_CREATE_LOGGER_SUCCESS = '[Logger] Batch Create Logger Success'
export const BATCH_CREATE_LOGGER_FAILURE = '[Logger] Batch Create Logger Failure'

export class ToCreateLoggerAction implements Action {
  readonly type = TO_CREATE_LOGGER
}

export class CancelCreateLoggerAction implements Action {
  readonly type = CANCEL_CREATE_LOGGER
}

export class CreateLoggerAction implements Action {
  readonly type = CREATE_LOGGER
  constructor(public log: ContactLogger) {}
}

export class CreateLoggerSuccessAction implements Action {
  readonly type = CREATE_LOGGER_SUCCESS
  constructor(public level: ContactLoggerLevel) {}
}

export class CreateLoggerFailureAction implements Action {
  readonly type = CREATE_LOGGER_FAILURE
}



export class ToEditLoggerAction implements Action {
  readonly type = TO_EDIT_LOGGER
  constructor(public log: ContactLogger) {}
}

export class CancelEditLoggerAction implements Action {
  readonly type = CANCEL_EDIT_LOGGER
}

export class EditLoggerAction implements Action {
  readonly type = EDIT_LOGGER
  constructor(public log: ContactLogger) {}
}

export class EditLoggerSuccessAction implements Action {
  readonly type = EDIT_LOGGER_SUCCESS
}

export class EditLoggerFailureAction implements Action {
  readonly type = EDIT_LOGGER_FAILURE
}



export class FetchLoggerAction implements Action {
  readonly type = FETCH_LOGGER
  constructor(public customerId?: string) {}
}

export class FetchLoggerSuccessAction implements Action {
  readonly type = FETCH_LOGGER_SUCCESS
  constructor(public logs: ContactLogger[]) {}
}

export class FetchLoggerFailureAction implements Action {
  readonly type = FETCH_LOGGER_FAILURE
}

export class BatchCreateLoggerAction implements Action {
  readonly type = BATCH_CREATE_LOGGER
  constructor(public payload: {customerIds: string[], log: ContactLogger}) {}
}

export class BatchCreateLoggerSuccessAction implements Action {
  readonly type = BATCH_CREATE_LOGGER_SUCCESS
}

export class BatchCreateLoggerFailureAction implements Action {
  readonly type = BATCH_CREATE_LOGGER_FAILURE
}

export type Actions =
ToCreateLoggerAction |
CancelCreateLoggerAction |
CreateLoggerAction |
CreateLoggerSuccessAction |
CreateLoggerFailureAction |

ToEditLoggerAction |
CancelEditLoggerAction |
EditLoggerAction |
EditLoggerSuccessAction |
EditLoggerFailureAction |

FetchLoggerAction |
FetchLoggerSuccessAction |
FetchLoggerFailureAction |

BatchCreateLoggerAction |
BatchCreateLoggerSuccessAction |
BatchCreateLoggerFailureAction
