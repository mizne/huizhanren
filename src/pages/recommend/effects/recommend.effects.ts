import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { ModalController, ToastController } from 'ionic-angular'
import * as fromRecommend from '../actions/recommend.action'
import * as fromMatcher from '../actions/matcher.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger } from '../../customer/models/logger.model'

import { RecommendService } from '../services/recommend.service'
import { LoggerService } from '../../../providers/logger.service'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State, getShowDetailID } from '../reducers'

@Injectable()
export class RecommendEffects {
  @Effect()
  fetchRecommend$ = this.actions$
    .ofType(fromRecommend.FETCH_RECOMMEND)
    .map((action: fromRecommend.FetchRecommendAction) => action.payload)
    .mergeMap(({ pageIndex, pageSize }) =>
      this.recommendService
        .fetchRecommend(pageIndex, pageSize)
        .map(
          recommends =>
            new fromRecommend.FetchRecommendSuccessAction(recommends)
        )
        .catch(err => Observable.of(new fromRecommend.FetchRecommendFailureAction()))
    )

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromRecommend.INVITE_RECOMMEND)
    .map((action: fromRecommend.InviteRecommendAction) => action.recommendID)
    .mergeMap(recommendID =>
      this.recommendService
        .InviteRecommend(recommendID)
        .concatMap(() => [
          new fromRecommend.InviteRecommendSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() => Observable.of(new fromRecommend.InviteRecommendFailureAction()))
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
        .catch(error => Observable.of(new fromRecommend.CreateLoggerFailureAction()))
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

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private recommendService: RecommendService,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
