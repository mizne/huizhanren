import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'

import * as fromVisitor from '../actions/visitor.action'
import * as fromMatcher from '../actions/matcher.action'
import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger, LoggerLevel } from '../../customer/models/logger.model'
import { VisitorService } from '../services/visitor.service'
import { VisitorMatcherService } from '../services/matcher.service'
import { LoggerService } from '../../../providers/logger.service'
import { ToInviteCustomerModal } from '../modals/to-invite-customer-modal/to-invite-customer-modal.component'
import {
  State,
  getVisitorShowDetailID,
  getVisitors,
  getCurrentVisitorCount
} from '../reducers'
import { getCompanyName, getBoothNo, getTenantId } from '../../login/reducers'

@Injectable()
export class VisitorEffects {
  @Effect()
  fetchVisitors$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS)
    .map((action: fromVisitor.FetchVisitorsAction) => action.params)
    .mergeMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取客户中...',
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

  @Effect({ dispatch: false })
  fetchVisitorsFailure$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '获取客户失败',
          position: 'top',
          duration: 3e3
        })
        .present()
    })

  @Effect()
  fetchVisitorsCount$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS_COUNT)
    .map((action: fromVisitor.FetchVisitorsCountAction) => action.params)
    .mergeMap(params => {
      return this.visitorService
        .fetchVisitorCount(params)
        .map(number => {
          return new fromVisitor.FetchVisitorsCountSuccessAction(number)
        })
        .catch(() => {
          return Observable.of(
            new fromVisitor.FetchVisitorsCountFailureAction()
          )
        })
    })

  @Effect()
  loadMoreVisitors$ = this.actions$
    .ofType(fromVisitor.LOAD_MORE_VISITORS)
    .map((action: fromVisitor.LoadMoreVisitorsAction) => action.params)
    .withLatestFrom(
      this.store.select(getCurrentVisitorCount),
      (params, currentTotal) => ({
        pageIndex: Math.ceil(currentTotal / 10) + 1,
        pageSize: 10,
        ...params
      })
    )
    .mergeMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多客户中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.visitorService
        .fetchVisitors(params)
        .map(visitors => {
          loadingCtrl.dismiss()
          return new fromVisitor.LoadMoreVisitorsSuccessAction(visitors)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromVisitor.LoadMoreVisitorsFailureAction())
        })
    })

  @Effect({ dispatch: false })
  loadMoreVisitorsFailure$ = this.actions$
    .ofType(fromVisitor.LOAD_MORE_VISITORS_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '获取更多客户失败',
          position: 'top',
          duration: 3e3
        })
        .present()
    })

  @Effect()
  toInviteVisitor$ = this.actions$
    .ofType(fromVisitor.TO_INVITE_VISITOR)
    .withLatestFrom(this.store.select(getVisitorShowDetailID), (_, id) => id)
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
    .withLatestFrom(this.store.select(getBoothNo), (params, boothNo) => {
      return {
        ...params,
        boothNo
      }
    })
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
  inviteVisitor$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR)
    .withLatestFrom(this.store.select(getVisitorShowDetailID), (_, id) => id)
    .mergeMap((visitorId) =>
      this.matcherService
        .createMatcher(visitorId)
        .concatMap(() => [
          new fromVisitor.InviteVisitorSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromVisitor.InviteVisitorFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteVisitorSuccess$ = this.actions$
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
  inviteVisitorFailure$ = this.actions$
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
    .withLatestFrom(this.store.select(getVisitorShowDetailID))
    .mergeMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(() => {
          return [
            new fromVisitor.CreateLoggerSuccessAction(log.level),
            new fromVisitor.FetchLoggerAction(customerId)
          ]
        })
        .catch(() => Observable.of(new fromVisitor.CreateLoggerFailureAction()))
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER_SUCCESS)
    .map((action: fromVisitor.CreateLoggerSuccessAction) => action.level)
    .do(level => {
      // 系统日志 不弹出toast
      if (level !== LoggerLevel.SYS) {
        let toast = this.toastCtrl.create({
          message: '添加日志成功',
          duration: 3000,
          position: 'top'
        })
        toast.present()
      }
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
        .catch(() => Observable.of(new fromVisitor.FetchLoggerFailureAction()))
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
