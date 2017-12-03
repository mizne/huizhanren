import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { ModalController, ToastController } from 'ionic-angular'
import * as fromExhibitor from '../actions/exhibitor.action'
import * as fromMatcher from '../actions/matcher.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { Logger } from '../../customer/models/logger.model'

import { ExhibitorService } from '../services/exhibitor.service'
import { LoggerService } from '../../../providers/logger.service'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State, getShowDetailID } from '../reducers'

@Injectable()
export class ExhibitorEffects {
  @Effect()
  fetchExhibitors$ = this.actions$
    .ofType(fromExhibitor.FETCH_EXHIBITORS)
    .map((action: fromExhibitor.FetchExhibitorsAction) => action.payload)
    .mergeMap(({ pageIndex, pageSize }) =>
      this.exhibitorService
        .fetchExhibitors(pageIndex, pageSize)
        .map(
          exhibitors =>
            new fromExhibitor.FetchExhibitorsSuccessAction(exhibitors)
        )
        .catch(err => Observable.of(new fromExhibitor.FetchExhibitorsFailureAction()))
    )

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR)
    .map((action: fromExhibitor.InviteExhibitorAction) => action.exhibitorID)
    .mergeMap(exhibitorID =>
      this.exhibitorService
        .inviteExhibitor(exhibitorID)
        .concatMap(() => [
          new fromExhibitor.InviteExhibitorSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() => Observable.of(new fromExhibitor.InviteExhibitorFailureAction()))
    )

  @Effect({ dispatch: false })
  inviteRecommendSuccess$ = this.actions$
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
  inviteRecommendFailure$ = this.actions$
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
        new Promise((res, rej) => {
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
        .concatMap(res => {
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
        .catch(error => Observable.of(new fromExhibitor.CreateLoggerFailureAction()))
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

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private exhibitorService: ExhibitorService,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
