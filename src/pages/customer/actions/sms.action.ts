import { Action } from '@ngrx/store'
import { SmsTemplate, SingleSendSmsContext, BatchSendSmsContext } from '../models/sms.model'

export const TO_CREATE_TEMPLATE = '[SMS] To Create Template'
export const CANCEL_CREATE_TEMPLATE = '[SMS] Cancel Create Template'
export const CREATE_TEMPLATE = '[SMS] Create Template'
export const CREATE_TEMPLATE_SUCCESS = '[SMS] Create Template Success'
export const CREATE_TEMPLATE_FAILURE = '[SMS] Create Template Failure'

export const FETCH_ALL_TEMPLATE = '[SMS] Fetch All Template'
export const FETCH_ALL_TEMPLATE_SUCCESS = '[SMS] Fetch All Template Success'
export const FETCH_ALL_TEMPLATE_FAILURE = '[SMS] Fetch All Template Failure'


export const TO_SEND_SMS_PAGE = '[SMS] To Send SMS Page'
export const PRE_SEND_SMS = '[SMS] Pre Send SMS'
export const NO_PHONE_TO_SEND_SMS = '[SMS] No Phone To Send SMS'
export const TO_SEND_SMS = '[SMS] To Send SMS'
export const CANCEL_SEND_SMS = '[SMS] Cancel Send SMS'
export const ENSURE_BATCH_SEND_SMS = '[SMS] Ensure Send SMS'
export const BATCH_SEND_SMS_SUCCESS = '[SMS] Send SMS Success'
export const MARK_CUSTOMER_HAS_SEND_SMS = '[SMS] Mark Customer Has Send SMS'
export const MARK_CUSTOMER_HAS_SEND_SMS_SUCCESS = '[SMS] Mark Customer Has Send SMS Success'
export const MARK_CUSTOMER_HAS_SEND_SMS_FAILURE = '[SMS] Mark Customer Has Send SMS Failure'
export const BATCH_SEND_SMS_FAILURE = '[SMS] Send SMS Failure'

export const TO_SINGLE_SEND_SMS = '[SMS] To Single Send SMS'
export const ENSURE_SINGLE_SEND_SMS = '[SMS] Ensure Single Send SMS'
export const CANCEL_SINGLE_SEND_SMS = '[SMS] Cancel Single Send SMS'
export const SINGLE_SEND_SMS_SUCCESS = '[SMS] Single Send SMS Success'
export const SINGLE_SEND_SMS_FAILURE = '[SMS] Single Send SMS Failure'

export const SELECT_PHONE = '[SMS] Select Phone'
export const CANCEL_SELECT_PHONE = '[SMS] Cancel Select Phone'

export const SELECT_ALL_PHONE = '[SMS] Select All Phone'
export const CANCEL_SELECT_ALL_PHONE = '[SMS] Cancel Select All Phone'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class ToCreateTemplateAction implements Action  {
  readonly type = TO_CREATE_TEMPLATE
}
export class CancelCreateTemplateAction implements Action {
  readonly type = CANCEL_CREATE_TEMPLATE
}
export class CreateTemplateAction implements Action {
  readonly type = CREATE_TEMPLATE
  constructor(public template: SmsTemplate) {}
}
export class CreateTemplateSuccessAction implements Action {
  readonly type = CREATE_TEMPLATE_SUCCESS
}
export class CreateTemplateFailureAction implements Action {
  readonly type = CREATE_TEMPLATE_FAILURE
}



export class FetchAllTemplateAction implements Action {
  readonly type = FETCH_ALL_TEMPLATE
}
export class FetchAllTemplateSuccessAction implements Action {
  readonly type = FETCH_ALL_TEMPLATE_SUCCESS
  constructor(public smsTemplates: SmsTemplate[]) {}
}
export class FetchAllTemplateFailureAction implements Action {
  readonly type = FETCH_ALL_TEMPLATE_FAILURE
}



export class ToSendSMSPageAction implements Action {
  readonly type = TO_SEND_SMS_PAGE
}
export class PreSendSMSAction implements Action {
  readonly type = PRE_SEND_SMS
  constructor(public templateId: string) {}
}
export class ToSendSMSAction implements Action {
  readonly type = TO_SEND_SMS
  constructor(public payload: {templateId: string, count: number}) {}
}
export class NoPhoneToSendSMSAction implements Action {
  readonly type = NO_PHONE_TO_SEND_SMS
}
export class CancelSendSMSAction implements Action {
  readonly type = CANCEL_SEND_SMS
}
export class EnsureBatchSendSMSAction implements Action {
  readonly type = ENSURE_BATCH_SEND_SMS
  constructor(public context: BatchSendSmsContext) {}
}
export class BatchSendSMSSuccessAction implements Action {
  readonly type = BATCH_SEND_SMS_SUCCESS
}
export class MarkCustomerHasSendSMSAction implements Action {
  readonly type = MARK_CUSTOMER_HAS_SEND_SMS
  constructor(public customerIds: string[]) {}
}
export class MarkCustomerHasSendSMSSuccessAction implements Action {
  readonly type = MARK_CUSTOMER_HAS_SEND_SMS_SUCCESS
}
export class MarkCustomerHasSendSMSFailureAction implements Action {
  readonly type = MARK_CUSTOMER_HAS_SEND_SMS_FAILURE
}
export class BatchSendSMSFailureAction implements Action {
  readonly type = BATCH_SEND_SMS_FAILURE
}



export class ToSingleSendSMSAction implements Action {
  readonly type = TO_SINGLE_SEND_SMS
  constructor(public phone: string) {}
}
export class CancelSingleSendSMSAction implements Action {
  readonly type = CANCEL_SINGLE_SEND_SMS
}
export class EnsureSingleSendSMSAction implements Action {
  readonly type = ENSURE_SINGLE_SEND_SMS
  constructor(public context: SingleSendSmsContext) {}
}
export class SingleSendSMSSuccessAction implements Action {
  readonly type = SINGLE_SEND_SMS_SUCCESS
}
export class SingleSendSMSFailureAction implements Action {
  readonly type = SINGLE_SEND_SMS_FAILURE
}


export class SelectPhoneAction implements Action {
  readonly type = SELECT_PHONE
  constructor(public payload: {id: string, phone: string}) {}
}
export class CancelSelectPhoneAction implements Action {
  readonly type = CANCEL_SELECT_PHONE
  constructor(public payload: {id: string, phone: string}) {}
}


export class SelectAllPhoneAction implements Action {
  readonly type = SELECT_ALL_PHONE
}
export class CancelSelectAllPhoneAction implements Action {
  readonly type = CANCEL_SELECT_ALL_PHONE
}



/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type Actions =
ToCreateTemplateAction |
CancelCreateTemplateAction |
CreateTemplateAction |
CreateTemplateSuccessAction |
CreateTemplateFailureAction |

FetchAllTemplateAction |
FetchAllTemplateSuccessAction |
FetchAllTemplateFailureAction |

ToSendSMSPageAction |
PreSendSMSAction |
ToSendSMSAction |
NoPhoneToSendSMSAction |
EnsureBatchSendSMSAction |
BatchSendSMSSuccessAction |
MarkCustomerHasSendSMSAction |
MarkCustomerHasSendSMSSuccessAction |
MarkCustomerHasSendSMSFailureAction |
BatchSendSMSFailureAction |

ToSingleSendSMSAction |
CancelSingleSendSMSAction |
EnsureSingleSendSMSAction |
SingleSendSMSSuccessAction |
SingleSendSMSFailureAction |

SelectPhoneAction |
CancelSelectPhoneAction |
SelectAllPhoneAction |
CancelSelectAllPhoneAction

