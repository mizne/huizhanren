import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'

import { ModalController } from 'ionic-angular'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State, getShowDetailCustomerId } from '../reducers'

import { ToastService } from '../../../providers/toast.service'

import * as fromLogger from '../actions/logger.action'
import { ToCreateLoggerModal } from '../modals/to-create-logger-modal.component'
import { ToEditLoggerModal } from '../modals/to-edit-logger-modal.component'
import { ContactLoggerService } from '../services/contact-logger.service'
import { ContactLogger, ContactLoggerLevel } from '../models/logger.model'

@Injectable()
export class LoggerEffects {
  @Effect()
  toCreateLogger$ = this.actions$
    .ofType(fromLogger.TO_CREATE_LOGGER)
    .switchMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const loggerModal = this.modalCtrl.create(ToCreateLoggerModal, {})

          loggerModal.onDidDismiss((log: ContactLogger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: ContactLogger) => {
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
    .switchMap(([log, customerId]) =>
      this.loggerService
        .createLog(log, customerId)
        .concatMap(() => {
          return [
            new fromLogger.CreateLoggerSuccessAction(log.level),
            new fromLogger.FetchLoggerAction()
          ]
        })
        .catch(() => Observable.of(new fromLogger.CreateLoggerFailureAction()))
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromLogger.CREATE_LOGGER_SUCCESS)
    .map((action: fromLogger.CreateLoggerSuccessAction) => action.level)
    .do(level => {
      // 非系统日志 弹出toast
      if (level !== ContactLoggerLevel.SYS) {
        this.toastService.show('添加日志成功')
      }
    })

  @Effect({ dispatch: false })
  createLoggerFailure$ = this.actions$
    .ofType(fromLogger.CREATE_LOGGER_FAILURE)
    .do(() => {
      this.toastService.show('添加日志失败')
    })

  @Effect()
  toEditLogger$ = this.actions$
    .ofType(fromLogger.TO_EDIT_LOGGER)
    .map((action: fromLogger.EditLoggerAction) => action.log)
    .switchMap(log => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const loggerModal = this.modalCtrl.create(ToEditLoggerModal, log)
          loggerModal.onDidDismiss((log: ContactLogger) => {
            res(log)
          })
          loggerModal.present()
        })
      ).map((log: ContactLogger) => {
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
    .switchMap(log =>
      this.loggerService
        .editLog(log)
        .concatMap(() => [
          new fromLogger.EditLoggerSuccessAction(),
          new fromLogger.FetchLoggerAction()
        ])
        .catch(() => Observable.of(new fromLogger.EditLoggerFailureAction()))
    )

  @Effect({ dispatch: false })
  editLoggerSuccess$ = this.actions$
    .ofType(fromLogger.EDIT_LOGGER_SUCCESS)
    .do(() => {
      this.toastService.show('编辑日志成功')
    })

  @Effect({ dispatch: false })
  editLoggerFailure$ = this.actions$
    .ofType(fromLogger.EDIT_LOGGER_FAILURE)
    .do(() => {
      this.toastService.show('编辑日志失败')
    })

  @Effect()
  fetchLogger$ = this.actions$
    .ofType(fromLogger.FETCH_LOGGER)
    .withLatestFrom(this.store.select(getShowDetailCustomerId))
    .switchMap(([_, customerId]) =>
      this.loggerService
        .fetchLogger(customerId)
        .map(logs => new fromLogger.FetchLoggerSuccessAction(logs))
        .catch(() => Observable.of(new fromLogger.FetchLoggerFailureAction()))
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
    .switchMap(({ customerIds, log }) => {
      return this.loggerService
        .batchCreateLog(customerIds, log)
        .map(() => new fromLogger.BatchCreateLoggerSuccessAction())
        .catch(() =>
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
    private toastService: ToastService,
    private loggerService: ContactLoggerService,
    private store: Store<State>
  ) {}
}
