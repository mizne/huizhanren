import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'
import * as fromRecommend from '../actions/recommend.action'
import * as fromMatcher from '../actions/matcher.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger } from '../../customer/models/logger.model'

import { RecommendService } from '../services/recommend.service'
import { MatcherService } from '../services/matcher.service'
import { LoggerService } from '../../../providers/logger.service'
import { Observable } from 'rxjs/Observable'

import { ToInviteCustomerModal } from '../modals/to-invite-customer-modal/to-invite-customer-modal.component'

import { Store } from '@ngrx/store'
import { State, getShowDetailID, getRecommends } from '../reducers'
import {
  getCompanyName,
  getSelectedExhibitionAddress
} from '../../login/reducers'
import { getTenantId } from '../../login/reducers'

@Injectable()
export class RecommendEffects {
  @Effect()
  fetchRecommend$ = this.actions$
    .ofType(fromRecommend.FETCH_RECOMMEND)
    .map((action: fromRecommend.FetchRecommendAction) => action.payload)
    .mergeMap((params) => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取推荐买家信息中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.recommendService
        .fetchRecommend(params)
        .map(recommends => {
          loadingCtrl.dismiss()
          return new fromRecommend.FetchRecommendSuccessAction(recommends)
        })
        .catch(err => {
          loadingCtrl.dismiss()
          return Observable.of(new fromRecommend.FetchRecommendFailureAction())
        })
    })

  @Effect()
  toInviteRecommend$ = this.actions$
    .ofType(fromRecommend.TO_INVITE_RECOMMEND)
    .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getRecommends), (id, recommends) =>
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
      this.store.select(getSelectedExhibitionAddress),
      (params, exhibitionAddress) => ({
        ...params,
        srcAddress: exhibitionAddress
      })
    )
    .mergeMap(params => {
      return Observable.fromPromise(
        new Promise((res, rej) => {
          const modal = this.modalCtrl.create(ToInviteCustomerModal, params)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromRecommend.InviteRecommendAction()
        } else {
          return new fromRecommend.CancelInviteRecommendAction()
        }
      })
    })

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromRecommend.INVITE_RECOMMEND)
    .withLatestFrom(this.store.select(getShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getRecommends), (id, recommends) => recommends.find(e => e.id === id))
    .withLatestFrom(this.store.select(getSelectedExhibitionAddress), (recommend, boothArea) => ({
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
          new fromRecommend.InviteRecommendSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromRecommend.InviteRecommendFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteRecommendSuccess$ = this.actions$
    .ofType(fromRecommend.INVITE_RECOMMEND_SUCCESS)
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
    .ofType(fromRecommend.INVITE_RECOMMEND_FAILURE)
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
    .ofType(fromRecommend.TO_CREATE_LOGGER)
    .mergeMap(() => {
      return Observable.fromPromise(
        new Promise((res, rej) => {
          const loggerModal = this.modalCtrl.create(ToCreateLoggerModal, {})

          loggerModal.onDidDismiss((log: Logger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: Logger) => {
        if (log) {
          return new fromRecommend.CreateLoggerAction(log)
        } else {
          return new fromRecommend.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromRecommend.CREATE_LOGGER)
    .map((action: fromRecommend.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getShowDetailID))
    .mergeMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(res => {
          // 系统日志 不弹出toast
          if (log.level === 'sys') {
            return [new fromRecommend.FetchLoggerAction(customerId)]
          } else {
            return [
              new fromRecommend.CreateLoggerSuccessAction(),
              new fromRecommend.FetchLoggerAction(customerId)
            ]
          }
        })
        .catch(error =>
          Observable.of(new fromRecommend.CreateLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromRecommend.CREATE_LOGGER_SUCCESS)
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
    .ofType(fromRecommend.CREATE_LOGGER_FAILURE)
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
    .ofType(fromRecommend.FETCH_LOGGER)
    .map((action: fromRecommend.FetchLoggerAction) => action.customerID)
    .mergeMap(customerId =>
      this.loggerService
        .fetchLogger(customerId)
        .map(logs => new fromRecommend.FetchLoggerSuccessAction(logs))
        .catch(error =>
          Observable.of(new fromRecommend.FetchLoggerFailureAction())
        )
    )

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private recommendService: RecommendService,
    private matcherService: MatcherService,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
