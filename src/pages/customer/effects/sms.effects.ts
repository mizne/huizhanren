import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'
import { ModalController, ToastController } from 'ionic-angular'
import { Store } from '@ngrx/store'

import { State, getPhonesToSendOfCustomers, getSmsTemplates } from '../reducers'
import { getSelectedExhibitionId } from '../../login/reducers'

import * as fromSms from '../actions/sms.action'
import * as fromCustomer from '../actions/customer.action'
import * as fromLogger from '../actions/logger.action'

import { SmsService } from '../../../providers/sms.service'
import { TenantService } from '../../../providers/tenant.service'
import { CustomerService } from '../services/customer.service'
import { SmsContent, BatchSendSmsContext } from '../models/sms.model'

import { ToSendSMSModal } from './../modals/to-send-sms-modal.component'
import { ToSingleSendSMSModal } from '../modals/to-single-send-sms-modal.component'
import { Logger } from '../models/logger.model';

@Injectable()
export class SmsEffects {
  @Effect()
  preSendSms$ = this.actions$
    .ofType(fromSms.PRE_SEND_SMS)
    .map((action: fromSms.PreSendSMSAction) => action.templateId)
    .withLatestFrom(this.store.select(getPhonesToSendOfCustomers))
    .map(([templateId, customers]) => {
      const phones = customers.reduce(
        (accu, curr) => (accu.push(...curr.phones), accu),
        []
      )
      if (phones.length === 0) {
        this.toastCtrl
          .create({
            message: '您还没有选择电话呢',
            duration: 3e3,
            position: 'top'
          })
          .present()
        return new fromSms.NoPhoneToSendSMSAction()
      } else {
        return new fromSms.ToSendSMSAction({
          templateId,
          count: phones.length
        })
      }
    })

  @Effect()
  toSendSms$ = this.actions$
    .ofType(fromSms.TO_SEND_SMS)
    .map((action: fromSms.ToSendSMSAction) => action.payload)
    .switchMap(({ templateId, count }) => {
      return Observable.create(observer => {
        const modal = this.modalCtrl.create(ToSendSMSModal, {
          count
        })
        modal.onDidDismiss(ok => {
          if (ok) {
            observer.next(templateId)
          } else {
            observer.complete()
          }
        })
        modal.present()
      })
    })
    .withLatestFrom(
      this.store.select(getSmsTemplates),
      (templateId, templates) => templates.find(e => e.id === templateId)
    )
    .withLatestFrom(
      this.tenantService.getBatchSendSmsParams(),
      (template, { customers, companyName, boothNo }) => {
        return new fromSms.EnsureBatchSendSMSAction(
          new BatchSendSmsContext({ customers, companyName, boothNo, template })
        )
      }
    )
    .catch(() => Observable.of(new fromSms.CancelSendSMSAction()))

  @Effect({ dispatch: false })
  cancelSendSms$ = this.actions$.ofType(fromSms.CANCEL_SEND_SMS).do(() => {
    this.toastCtrl
      .create({
        message: '取消发送短信',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect()
  ensureSendSms$ = this.actions$
    .ofType(fromSms.ENSURE_BATCH_SEND_SMS)
    .map((action: fromSms.EnsureBatchSendSMSAction) => action.context)
    .switchMap(context => {
      return this.smsService
        .sendMessage(context.getTemplate().id, context.computeRequestParams())
        .concatMap(() => {
          return [
            new fromSms.BatchSendSMSSuccessAction(),
            new fromLogger.BatchCreateLoggerAction({
              customerIds: context.getCustomerIds(),
              log: Logger.generateSysLoggerForSms(context.getTemplate().label)
            }),
            new fromSms.MarkCustomerHasSendSMSAction(context.getCustomerIds()),
            new fromCustomer.ToListableStatusAction()
          ]
        })
        .catch(() => Observable.of(new fromSms.BatchSendSMSFailureAction()))
    })

  @Effect()
  markCustomerHasSendSms$ = this.actions$
    .ofType(fromSms.MARK_CUSTOMER_HAS_SEND_SMS)
    .map((action: fromSms.MarkCustomerHasSendSMSAction) => action.customerIds)
    .withLatestFrom(this.store.select(getSelectedExhibitionId))
    .mergeMap(([customerIds, exhibitionId]) => {
      return this.customerService
        .markCustomersHasSendSms(customerIds, exhibitionId)
        .map(() => new fromSms.MarkCustomerHasSendSMSSuccessAction())
        .catch(() =>
          Observable.of(new fromSms.MarkCustomerHasSendSMSFailureAction())
        )
    })

  @Effect()
  markCustomerHasSendSmsSuccess$ = this.actions$
    .ofType(fromSms.MARK_CUSTOMER_HAS_SEND_SMS_SUCCESS)
    .map(() => new fromCustomer.FetchAllAction())

  @Effect({ dispatch: false })
  sendSmsSuccess$ = this.actions$
    .ofType(fromSms.BATCH_SEND_SMS_SUCCESS, fromSms.SINGLE_SEND_SMS_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '发送短信成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  sendSmsFailure$ = this.actions$
    .ofType(fromSms.BATCH_SEND_SMS_FAILURE, fromSms.SINGLE_SEND_SMS_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '发送短信失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  toSingleSendSMS$ = this.actions$
    .ofType(fromSms.TO_SINGLE_SEND_SMS)
    .map((action: fromSms.ToSingleSendSMSAction) => action.phone)
    .do(phone => {
      this.modalCtrl.create(ToSingleSendSMSModal, { phone }).present()
    })

  @Effect()
  ensureSingleSendSMS$ = this.actions$
    .ofType(fromSms.ENSURE_SINGLE_SEND_SMS)
    .map((action: fromSms.EnsureSingleSendSMSAction) => action.context)
    .mergeMap(context => {
      const smsContents: SmsContent[] = context.computeRequestParams()

      return this.smsService
        .sendMessage(context.getTemplate().id, smsContents)
        .concatMap(() => [
          new fromSms.SingleSendSMSSuccessAction(),
          new fromLogger.CreateLoggerAction(Logger.generateSysLoggerForSms(context.getTemplate().label)),
          new fromSms.MarkCustomerHasSendSMSAction([context.getCustomer().id])
        ])
        .catch(() => Observable.of(new fromSms.SingleSendSMSFailureAction()))
    })

  @Effect()
  fetchAllTemplate$ = this.actions$
    .ofType(fromSms.FETCH_ALL_TEMPLATE)
    .mergeMap(() =>
      this.smsService
        .fetchAllTemplate()
        .map(
          smsTemplates =>
            new fromSms.FetchAllTemplateSuccessAction(smsTemplates)
        )
        .catch(() => Observable.of(new fromSms.FetchAllTemplateFailureAction()))
    )

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private smsService: SmsService,
    private store: Store<State>,
    private customerService: CustomerService,
    private tenantService: TenantService
  ) {}
}
