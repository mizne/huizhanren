import { Action } from '@ngrx/store'
import { SmsTemplate, SingleSendSmsContext, BatchSendSmsContext } from '../models/sms.model'

export const CREATE_TEMPLATE = '[sms] Create Template'
export const CREATE_TEMPLATE_SUCCESS = '[sms] Create Template Success'
export const CREATE_TEMPLATE_FAILURE = '[sms] Create Template Failure'

export const FETCH_ALL_TEMPLATE = '[sms] Fetch All Template'
export const FETCH_ALL_TEMPLATE_SUCCESS = '[sms] Fetch All Template Success'
export const FETCH_ALL_TEMPLATE_FAILURE = '[sms] Fetch All Template Failure'


export const TO_SEND_SMS_PAGE = '[sms] To Send SMS Page'
export const PRE_SEND_SMS = '[sms] Pre Send SMS'
export const NO_PHONE_TO_SEND_SMS = '[sms] No Phone To Send SMS'
export const TO_SEND_SMS = '[sms] To Send SMS'
export const CANCEL_SEND_SMS = '[sms] Cancel Send SMS'
export const ENSURE_BATCH_SEND_SMS = '[sms] Ensure Send SMS'
export const BATCH_SEND_SMS_SUCCESS = '[sms] Send SMS Success'
export const MARK_CUSTOMER_HAS_SEND_SMS = '[sms] Mark Customer Has Send SMS'
export const MARK_CUSTOMER_HAS_SEND_SMS_SUCCESS = '[sms] Mark Customer Has Send SMS Success'
export const MARK_CUSTOMER_HAS_SEND_SMS_FAILURE = '[sms] Mark Customer Has Send SMS Failure'
export const BATCH_SEND_SMS_FAILURE = '[sms] Send SMS Failure'

export const TO_SINGLE_SEND_SMS = '[sms] To Single Send SMS'
export const ENSURE_SINGLE_SEND_SMS = '[sms] Ensure Single Send SMS'
export const CANCEL_SINGLE_SEND_SMS = '[sms] Cancel Single Send SMS'
export const SINGLE_SEND_SMS_SUCCESS = '[sms] Single Send SMS Success'
export const SINGLE_SEND_SMS_FAILURE = '[sms] Single Send SMS Failure'

export const SELECT_PHONE = '[sms] Select Phone'
export const CANCEL_SELECT_PHONE = '[sms] Cancel Select Phone'

export const SELECT_ALL_PHONE = '[sms] Select All Phone'
export const CANCEL_SELECT_ALL_PHONE = '[sms] Cancel Select All Phone'


/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */
export class CreateTemplateAction implements Action {
  readonly type = CREATE_TEMPLATE
  constructor(public payload: any) {}
}
export class CreateTemplateSuccessAction implements Action {
  readonly type = CREATE_TEMPLATE_SUCCESS
  constructor(public payload: any) {}
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

