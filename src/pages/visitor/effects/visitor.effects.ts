import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'
import * as fromVisitor from '../actions/visitor.action'
import * as fromMatcher from '../actions/matcher.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger } from '../../customer/models/logger.model'

import { VisitorService } from '../services/visitor.service'
import { VisitorMatcherService } from '../services/matcher.service'
import { LoggerService } from '../../../providers/logger.service'
import { Observable } from 'rxjs/Observable'

import { ToInviteCustomerModal } from '../modals/to-invite-customer-modal/to-invite-customer-modal.component'

import { Store } from '@ngrx/store'
import { State, getShowDetailID, getVisitors } from '../reducers'
import {
  getCompanyName,
  getBoothNo,
  getTenantId,
} from '../../login/reducers'

@Injectable()
export class VisitorEffects {
  @Effect()
  fetchRecommend$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS)
    .map((action: fromVisitor.FetchVisitorsAction) => action.payload)
    .mergeMap((params) => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取数据中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.visitorService
        .fetchVisitors(params)
        .map(recommends => {
          loadingCtrl.dismiss()
          return new fromVisitor.FetchVisitorsSuccessAction(recommends)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromVisitor.FetchVisitorsFailureAction())
        })
    })

  @Effect()
  toInviteRecommend$ = this.actions$
    .ofType(fromVisitor.TO_INVITE_VISITOR)
    .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getVisitors), (id, recommends) =>
      recommends.find(e => e.id === id)
    )
    .withLatestFrom(
      this.store.select(getCompanyName),
      (recommend, srcCompanyName) => ({
        destName: recommend.name,
        destTitle: recommend.title,
        destCompany: recommend.company,
        srcCompany: srcCompanyName
      })
    )
    .withLatestFrom(
      this.store.select(getBoothNo),
      (params, boothNo) => {
        return ({
          ...params,
          boothNo
        })
      }
    )
    .mergeMap(params => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToInviteCustomerModal, params)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromVisitor.InviteVisitorAction()
        } else {
          return new fromVisitor.CancelInviteVisitorAction()
        }
      })
    })

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR)
    .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getVisitors), (id, recommends) => recommends.find(e => e.id === id))
    .withLatestFrom(this.store.select(getBoothNo), (recommend, boothArea) => ({
      recommend, boothArea
    }))
    .withLatestFrom(this.store.select(getTenantId), ({recommend, boothArea}, tenantId) => ({
      recommend, boothArea, tenantId
    }))
    .withLatestFrom(this.store.select(getShowDetailID), ({ recommend, boothArea, tenantId }, customerId) => ({
      recommend, boothArea, tenantId, customerId
    }))
    .mergeMap(({ recommend, boothArea, tenantId, customerId }) =>
      this.matcherService
        .createMatcher(recommend, boothArea, tenantId, customerId)
        .concatMap(() => [
          new fromVisitor.InviteVisitorSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromVisitor.InviteVisitorFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteRecommendSuccess$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '约请发送成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  inviteRecommendFailure$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '约请发送失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  toCreateLogger$ = this.actions$
    .ofType(fromVisitor.TO_CREATE_LOGGER)
    .mergeMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const loggerModal = this.modalCtrl.create(ToCreateLoggerModal, {})

          loggerModal.onDidDismiss((log: Logger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: Logger) => {
        if (log) {
          return new fromVisitor.CreateLoggerAction(log)
        } else {
          return new fromVisitor.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER)
    .map((action: fromVisitor.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getShowDetailID))
    .mergeMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(() => {
          // 系统日志 不弹出toast
          if (log.level === 'sys') {
            return [new fromVisitor.FetchLoggerAction(customerId)]
          } else {
            return [
              new fromVisitor.CreateLoggerSuccessAction(),
              new fromVisitor.FetchLoggerAction(customerId)
            ]
          }
        })
        .catch(() =>
          Observable.of(new fromVisitor.CreateLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER_SUCCESS)
    .do(() => {
      let toast = this.toastCtrl.create({
        message: '添加日志成功',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    })

  @Effect({ dispatch: false })
  createLoggerFailure$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER_FAILURE)
    .do(() => {
      let toast = this.toastCtrl.create({
        message: '添加日志失败',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    })

  @Effect()
  fetchLogger$ = this.actions$
    .ofType(fromVisitor.FETCH_LOGGER)
    .map((action: fromVisitor.FetchLoggerAction) => action.customerID)
    .mergeMap(customerId =>
      this.loggerService
        .fetchLogger(customerId)
        .map(logs => new fromVisitor.FetchLoggerSuccessAction(logs))
        .catch(() =>
          Observable.of(new fromVisitor.FetchLoggerFailureAction())
        )
    )

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private visitorService: VisitorService,
    private matcherService: VisitorMatcherService,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
