import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'
import * as fromExhibitor from '../actions/exhibitor.action'
import * as fromMatcher from '../actions/matcher.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger } from '../../customer/models/logger.model'

import { ExhibitorService } from '../services/exhibitor.service'
import { ExhibitorMatcherService } from '../services/matcher.service'

import { LoggerService } from '../../../providers/logger.service'
import { Observable } from 'rxjs/Observable'

import { ToInviteExhibitorModal } from '../modals/to-invite-exhibitor-modal/to-invite-exhibitor-modal.component'
import { ToShowProductModal } from '../modals/to-show-product-modal/to-show-product-modal.component'

import { Store } from '@ngrx/store'
import { State, getShowDetailID, getExhibitors } from '../reducers'
import {
  getTenantId,
  getCompanyName,
  getSelectedExhibitionAddress
} from '../../login/reducers'

@Injectable()
export class ExhibitorEffects {
  @Effect()
  fetchExhibitors$ = this.actions$
    .ofType(fromExhibitor.FETCH_EXHIBITORS)
    .map((action: fromExhibitor.FetchExhibitorsAction) => action.payload)
    .mergeMap(({ pageIndex, pageSize }) => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取展商信息中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()

      return this.exhibitorService
        .fetchExhibitors(pageIndex, pageSize)
        .map(exhibitors => {
          loadingCtrl.dismiss()
          return new fromExhibitor.FetchExhibitorsSuccessAction(exhibitors)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromExhibitor.FetchExhibitorsFailureAction())
        })
    })

  @Effect()
  toInviteExhibitor$ = this.actions$
    .ofType(fromExhibitor.TO_INVITE_EXHIBITOR)
    .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getExhibitors), (id, exhibitors) =>
      exhibitors.find(e => e.id === id)
    )
    .withLatestFrom(
      this.store.select(getCompanyName),
      (exhibitor, srcCompanyName) => ({
        destName: exhibitor.name,
        srcName: srcCompanyName,
        destAddress: exhibitor.booth
      })
    )
    .withLatestFrom(
      this.store.select(getSelectedExhibitionAddress),
      (params, exhibitionAddress) => ({
        ...params,
        srcAddress: exhibitionAddress
      })
    )
    .mergeMap(params => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToInviteExhibitorModal, params)
          modal.onDidDismiss(boothNo => {
            res(boothNo)
          })
          modal.present()
        })
      ).map((boothNo: string) => {
        if (boothNo) {
          return new fromExhibitor.InviteExhibitorAction(boothNo)
        } else {
          return new fromExhibitor.CancelInviteExhibitorAction()
        }
      })
    })

  // @Effect()
  // inviteExhibitor$ = this.actions$
  //   .ofType(fromExhibitor.INVITE_EXHIBITOR)
  //   .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
  //   .mergeMap(exhibitorID =>
  //     this.exhibitorService
  //       .inviteExhibitor(exhibitorID)
  //       .concatMap(() => [
  //         new fromExhibitor.InviteExhibitorSuccessAction(),
  //         new fromMatcher.FetchMatchersAction()
  //       ])
  //       .catch(() =>
  //         Observable.of(new fromExhibitor.InviteExhibitorFailureAction())
  //       )
  //   )

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR)
    .map((action: fromExhibitor.InviteExhibitorAction) => action.boothNo)
    .withLatestFrom(this.store.select(getShowDetailID), (boothNo, id) => ({
      boothNo,
      id
    }))
    .withLatestFrom(this.store.select(getExhibitors), ({ boothNo, id }, exhibitors) => ({
      boothNo,
      exhibitor: exhibitors.find(e => e.id === id)
    })
    )

    .withLatestFrom(this.store.select(getTenantId), ({ boothNo, exhibitor }, tenantId) => ({
      exhibitor,
      tenantId,
      boothNo
    }))
    .mergeMap(({ exhibitor, boothNo, tenantId }) =>
      this.matcherService
        .createMatcher(exhibitor, boothNo, tenantId)
        .concatMap(() => [
          new fromExhibitor.InviteExhibitorSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromExhibitor.InviteExhibitorFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteExhibitorSuccess$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR_SUCCESS)
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
  inviteExhibitorFailure$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR_FAILURE)
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
    .ofType(fromExhibitor.TO_CREATE_LOGGER)
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
          return new fromExhibitor.CreateLoggerAction(log)
        } else {
          return new fromExhibitor.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromExhibitor.CREATE_LOGGER)
    .map((action: fromExhibitor.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getShowDetailID))
    .mergeMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(() => {
          // 系统日志 不弹出toast
          if (log.level === 'sys') {
            return [new fromExhibitor.FetchLoggerAction(customerId)]
          } else {
            return [
              new fromExhibitor.CreateLoggerSuccessAction(),
              new fromExhibitor.FetchLoggerAction(customerId)
            ]
          }
        })
        .catch(() =>
          Observable.of(new fromExhibitor.CreateLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromExhibitor.CREATE_LOGGER_SUCCESS)
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
    .ofType(fromExhibitor.CREATE_LOGGER_FAILURE)
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
    .ofType(fromExhibitor.FETCH_LOGGER)
    .map((action: fromExhibitor.FetchLoggerAction) => action.exhibitionID)
    .mergeMap(exhibitionID =>
      this.loggerService
        .fetchLogger(exhibitionID)
        .map(logs => new fromExhibitor.FetchLoggerSuccessAction(logs))
        .catch(() =>
          Observable.of(new fromExhibitor.FetchLoggerFailureAction())
        )
    )

    @Effect({ dispatch: false })
    toShowProduct$ = this.actions$.ofType(fromExhibitor.TO_SHOW_PRODUCT)
    .map((action: fromExhibitor.ToShowProcuctAction) => action.product)
    .do((product) => {
      this.modalCtrl.create(ToShowProductModal, product).present()
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private exhibitorService: ExhibitorService,
    private matcherService: ExhibitorMatcherService,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
