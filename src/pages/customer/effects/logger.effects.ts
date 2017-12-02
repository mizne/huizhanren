import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'

import { ModalController, ToastController } from 'ionic-angular'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State, getShowDetailCustomerId } from '../reducers'

import * as fromLogger from '../actions/logger.action'
import { ToCreateLoggerModal } from '../modals/to-create-logger-modal.component'
import { ToEditLoggerModal } from '../modals/to-edit-logger-modal.component'
import { LoggerService } from '../../../providers/logger.service'
import { Logger } from '../models/logger.model'

@Injectable()
export class LoggerEffects {
  @Effect()
  toCreateLogger$ = this.actions$
    .ofType(fromLogger.TO_CREATE_LOGGER)
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
          return new fromLogger.CreateLoggerAction(log)
        } else {
          return new fromLogger.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromLogger.CREATE_LOGGER)
    .map((action: fromLogger.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getShowDetailCustomerId))
    .mergeMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(res => {
          // 系统日志 不弹出toast
          if (log.level === 'sys') {
            return [new fromLogger.FetchLoggerAction()]
          } else {
            return [
              new fromLogger.CreateLoggerSuccessAction(),
              new fromLogger.FetchLoggerAction()
            ]
          }
        })
        .catch(error =>
          Observable.of(new fromLogger.CreateLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromLogger.CREATE_LOGGER_SUCCESS)
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
    .ofType(fromLogger.CREATE_LOGGER_FAILURE)
    .do(() => {
      let toast = this.toastCtrl.create({
        message: '添加日志失败',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    })

  @Effect()
  toEditLogger$ = this.actions$
    .ofType(fromLogger.TO_EDIT_LOGGER)
    .map((action: fromLogger.EditLoggerAction) => action.log)
    .mergeMap(log => {
      return Observable.fromPromise(
        new Promise((res, rej) => {
          const loggerModal = this.modalCtrl.create(ToEditLoggerModal, log)

          loggerModal.onDidDismiss((log: Logger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: Logger) => {
        if (log) {
          return new fromLogger.EditLoggerAction(log)
        } else {
          return new fromLogger.CancelEditLoggerAction()
        }
      })
    })

  @Effect()
  editLogger$ = this.actions$
    .ofType(fromLogger.EDIT_LOGGER)
    .map((action: fromLogger.EditLoggerAction) => action.log)
    .mergeMap(log =>
      this.loggerService
        .editLog(log)
        .concatMap(res => [
          new fromLogger.EditLoggerSuccessAction(),
          new fromLogger.FetchLoggerAction()
        ])
        .catch(error => Observable.of(new fromLogger.EditLoggerFailureAction()))
    )

  @Effect({ dispatch: false })
  editLoggerSuccess$ = this.actions$
    .ofType(fromLogger.EDIT_LOGGER_SUCCESS)
    .do(() => {
      let toast = this.toastCtrl.create({
        message: '编辑日志成功',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    })

  @Effect({ dispatch: false })
  editLoggerFailure$ = this.actions$
    .ofType(fromLogger.EDIT_LOGGER_FAILURE)
    .do(() => {
      let toast = this.toastCtrl.create({
        message: '编辑日志失败',
        duration: 3000,
        position: 'top'
      })
      toast.present()
    })

  @Effect()
  fetchLogger$ = this.actions$
    .ofType(fromLogger.FETCH_LOGGER)
    .withLatestFrom(this.store.select(getShowDetailCustomerId))
    .mergeMap(([_, customerId]) =>
      this.loggerService
        .fetchLogger(customerId)
        .map(logs => new fromLogger.FetchLoggerSuccessAction(logs))
        .catch(error =>
          Observable.of(new fromLogger.FetchLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  fetchLoggerSuccess$ = this.actions$
    .ofType(fromLogger.FETCH_LOGGER_SUCCESS)
    .do(() => {
      // let toast = this.toastCtrl.create({
      //   message: '查询日志成功',
      //   duration: 3000,
      //   position: 'top'
      // })
      // toast.present()
    })

  @Effect({ dispatch: false })
  fetchLoggerFailure$ = this.actions$
    .ofType(fromLogger.FETCH_LOGGER_FAILURE)
    .do(() => {
      // let toast = this.toastCtrl.create({
      //   message: '查询日志失败',
      //   duration: 3000,
      //   position: 'top'
      // })
      // toast.present()
    })

  @Effect()
  batchCreateLogger$ = this.actions$
    .ofType(fromLogger.BATCH_CREATE_LOGGER)
    .map((action: fromLogger.BatchCreateLoggerAction) => action.payload)
    .mergeMap(({ customerIds, log }) => {
      return this.loggerService
        .batchCreateLog(customerIds, log)
        .map(res => new fromLogger.BatchCreateLoggerSuccessAction())
        .catch(e =>
          Observable.of(new fromLogger.BatchCreateLoggerFailureAction())
        )
    })

  @Effect({ dispatch: false })
  batchCreateLoggerSuccess$ = this.actions$
    .ofType(fromLogger.BATCH_CREATE_LOGGER_SUCCESS)
    .do(() => {
      // let toast = this.toastCtrl.create({
      //   message: '批量新增日志成功',
      //   duration: 3000,
      //   position: 'top'
      // })
      // toast.present()
    })

  @Effect({ dispatch: false })
  batchCreateLoggerFailure$ = this.actions$
    .ofType(fromLogger.BATCH_CREATE_LOGGER_FAILURE)
    .do(() => {
      // let toast = this.toastCtrl.create({
      //   message: '批量新增日志失败',
      //   duration: 3000,
      //   position: 'top'
      // })
      // toast.present()
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loggerService: LoggerService,
    private store: Store<State>
  ) {}
}
