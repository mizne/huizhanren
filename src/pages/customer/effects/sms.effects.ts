import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { ModalController, ToastController } from 'ionic-angular'

import { Store } from '@ngrx/store'
import {
  State,
  getCustomers,
  getPhonesToSendOfCustomers,
  getShowDetailCustomerId,
  getSmsTemplates
} from '../reducers'
import { getSelectedExhibitionId } from '../../login/reducers'

import * as fromSms from '../actions/sms.action'
import * as fromCustomer from '../actions/customer.action'
import * as fromLogger from '../actions/logger.action'

import { SmsService } from '../../../providers/sms.service'
import { CustomerService } from '../services/customer.service'
import { SmsContent, SMS_TEMPLATE_BASE_URL } from '../models/sms.model'

import { ToSendSMSModal } from './../modals/to-send-sms-modal.component'
import { ToSingleSendSMSModal } from '../modals/to-single-send-sms-modal.component'

@Injectable()
export class SmsEffects {
  @Effect()
  preSendSms$ = this.actions$
    .ofType(fromSms.PRE_SEND_SMS)
    .map((action: fromSms.EnsureSendSMSAction) => action.templateId)
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

  @Effect({ dispatch: false })
  toSendSms$ = this.actions$
    .ofType(fromSms.TO_SEND_SMS)
    .map((action: fromSms.ToSendSMSAction) => action.payload)
    .do(({ templateId, count }) => {
      this.modalCtrl.create(ToSendSMSModal, { templateId, count }).present()
    })

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
    .ofType(fromSms.ENSURE_SEND_SMS)
    .map((action: fromSms.EnsureSendSMSAction) => action.templateId)
    .withLatestFrom(
      this.store.select(getSmsTemplates),
      (templateId, templates) => templates.find(e => e.id === templateId)
    )
    .withLatestFrom(
      this.store.select(getPhonesToSendOfCustomers),
      (template, customers) => ({ template, customers })
    )
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ({ template, customers }, exhibitionId) => ({
        template,
        customers,
        exhibitionId
      })
    )
    .mergeMap(({ template, customers, exhibitionId }) => {
      const customerPhones = customers
        .map(e => e.phones.map(f => ({ phone: f, name: e.customerName })))
        .reduce((accu, curr) => (accu.push(...curr), accu), [])

      // TODO 模板变量从 customer中获取
      const smsContents: SmsContent[] = customerPhones.map(e => ({
        phone: e.phone,
        content: [e.name, `${SMS_TEMPLATE_BASE_URL}/${exhibitionId}`]
      }))

      return this.smsService
        .sendMessage(template.id, smsContents)
        .concatMap(() => {
          return [
            new fromSms.SendSMSSuccessAction(),
            new fromLogger.BatchCreateLoggerAction({
              customerIds: customers.map(e => e.customerId),
              log: {
                level: 'sys',
                content: `系统: 发送 【${template.label}】 短信成功!`
              }
            }),
            new fromSms.MarkCustomerHasSendSMSAction(
              customers.map(e => e.customerId)
            ),
            new fromCustomer.ToListableStatusAction()
          ]
        })
        .catch(() => Observable.of(new fromSms.SendSMSFailureAction()))
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
    .ofType(fromSms.SEND_SMS_SUCCESS, fromSms.SINGLE_SEND_SMS_SUCCESS)
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
    .ofType(fromSms.SEND_SMS_FAILURE, fromSms.SINGLE_SEND_SMS_FAILURE)
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
    .map((action: fromSms.EnsureSingleSendSMSAction) => action.payload)
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ({ content, phone, templateId }, customerId) => ({ content, phone, templateId, customerId })
    )
    .withLatestFrom(
      this.store.select(getCustomers),
      ({ content, phone, customerId, templateId }, customers) => {
        const customer = customers.find(e => e.id === customerId)
        return {
          content,
          phone,
          customer,
          templateId
        }
      }
    )
    .withLatestFrom(
      this.store.select(getSmsTemplates),
      ({ content, phone, customer, templateId }, templates) => {
        const template = templates.find(e => e.id === templateId)
        return {
          content,
          phone,
          customer,
          template
        }
      }
    )
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ({ content, phone, customer, template }, exhibitionId) => ({
        content,
        phone,
        customer,
        exhibitionId,
        template
      })
    )
    .mergeMap(({ content, phone, customer, exhibitionId, template }) => {
      // TODO 模板变量从 customer中获取
      const smsContents: SmsContent[] = [
        {
          phone,
          content
        }
      ]
      return this.smsService
        .sendMessage(template.id, smsContents)
        .concatMap(() => [
          new fromSms.SingleSendSMSSuccessAction(),
          new fromLogger.CreateLoggerAction({
            level: 'sys',
            content: `系统: 发送 【${template.label}】 短信成功!`
          }),
          new fromSms.MarkCustomerHasSendSMSAction([customer.id])
        ])
        .catch(() => Observable.of(new fromSms.SingleSendSMSFailureAction()))
    })

  @Effect()
  fetchAllTemplate$ = this.actions$
    .ofType(fromSms.FETCH_ALL_TEMPLATE)
    .mergeMap(() =>
      this.smsService
        .fetchAllTemplate()
        .map(smsTemplates => new fromSms.FetchAllTemplateSuccessAction(smsTemplates))
        .catch(() => Observable.of(new fromSms.FetchAllTemplateFailureAction()))
    )

  @Effect({ dispatch: false })
  fetchAllTemplateSuccess$ = this.actions$
    .ofType(fromSms.FETCH_ALL_TEMPLATE_SUCCESS)
    .do(() => {
      // this.toastCtrl.create({
      //   message: '获取短信模板列表成功',
      //   duration: 3e3,
      //   position: 'top'
      // })
      // .present()
    })

  @Effect({ dispatch: false })
  fetchAllTemplateFailure$ = this.actions$
    .ofType(fromSms.FETCH_ALL_TEMPLATE_FAILURE)
    .do(() => {
      // this.toastCtrl
      //   .create({
      //     message: '获取短信模板列表失败',
      //     duration: 3e3,
      //     position: 'top'
      //   })
      //   .present()
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private smsService: SmsService,
    private store: Store<State>,
    private customerService: CustomerService
  ) {}
}
