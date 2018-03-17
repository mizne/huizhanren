import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { ModalController } from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State, getShowDetailCustomerId } from '../reducers'
import { ToastService } from '../../../providers/toast.service'
import * as fromNotification from '../actions/notification.action'
import { ToCreateNotificationModal } from '../modals/to-create-notification-modal.component'
import { ToEditNotificationModal } from '../modals/to-edit-notification-modal.component'
import { NotificationService } from '../services/notification.service'
import { Notification } from '../models/notification.model'

@Injectable()
export class NotificationEffects {
  @Effect()
  toCreateNotification$ = this.actions$.ofType(fromNotification.TO_CREATE_NOTIFICATION)
  .switchMap(() => {
    return Observable.fromPromise(new Promise((res, _) => {
      const notificationModal = this.modalCtrl.create(ToCreateNotificationModal, {})

      notificationModal.onDidDismiss((notification: Notification) => {
        res(notification)
      })

      notificationModal.present()
    })).map((notification: Notification) => {
      if (notification) {
        return new fromNotification.CreateNotificationAction(notification)
      } else {
        return new fromNotification.CancelCreateNotificationAction()
      }
    })
  })

  @Effect()
  createNotification$ = this.actions$.ofType(fromNotification.CREATE_NOTIFICATION)
  .map((action: fromNotification.CreateNotificationAction) => action.notification)
  .withLatestFrom(this.store.select(getShowDetailCustomerId))
  .switchMap(([notification, customerId]) =>
    this.notificationService.createNotification(notification, customerId)
    .concatMap(() => [
      new fromNotification.CreateNotificationSuccessAction(),
      new fromNotification.FetchNotificationAction()
    ])
    .catch(() => Observable.of(new fromNotification.CreateNotificationFailureAction()))
  )

  @Effect({ dispatch: false })
  createNotificationSuccess$ = this.actions$.ofType(fromNotification.CREATE_NOTIFICATION_SUCCESS)
  .do(() => {
    this.toastService.show('添加提醒成功')
  })

  @Effect({ dispatch: false })
  createNotificationFailure$ = this.actions$.ofType(fromNotification.CREATE_NOTIFICATION_FAILURE)
  .do(() => {
    this.toastService.show('添加提醒失败')
  })


  @Effect()
  toEditNotification$ = this.actions$.ofType(fromNotification.TO_EDIT_NOTIFICATION)
  .map((action: fromNotification.ToEditNotificationAction) => action.notification)
  .switchMap((notification: Notification) => {
    return Observable.fromPromise(new Promise((res, _) => {
      const notificationModal = this.modalCtrl.create(ToEditNotificationModal, notification)

      notificationModal.onDidDismiss((notification: Notification) => {
        res(notification)
      })

      notificationModal.present()
    })).map((notification: Notification) => {
      if (notification) {
        return new fromNotification.EditNotificationAction(notification)
      } else {
        return new fromNotification.CancelEditNotificationAction()
      }
    })
  })


  @Effect()
  editNotification$ = this.actions$.ofType(fromNotification.EDIT_NOTIFICATION)
  .map((action: fromNotification.EditNotificationAction) => action.notification)
  .switchMap(notification =>
    this.notificationService.editNotification(notification)
    .concatMap(() => [
      new fromNotification.EditNotificationSuccessAction(),
      new fromNotification.FetchNotificationAction()
    ])
    .catch(() => Observable.of(new fromNotification.EditNotificationFailureAction()))
  )

  @Effect({ dispatch: false })
  editNotificationSuccess$ = this.actions$.ofType(fromNotification.EDIT_NOTIFICATION_SUCCESS)
  .do(() => {
    this.toastService.show('编辑提醒成功')
  })

  @Effect({ dispatch: false })
  editNotificationFailure$ = this.actions$.ofType(fromNotification.EDIT_NOTIFICATION_FAILURE)
  .do(() => {
    this.toastService.show('编辑提醒失败')
  })

  @Effect()
  fetchNotification$ = this.actions$.ofType(fromNotification.FETCH_NOTIFICATION)
  .withLatestFrom(this.store.select(getShowDetailCustomerId))
  .switchMap(([_, customerId]) =>
    this.notificationService.fetchNotifications(customerId)
    .map(notifications => new fromNotification.FetchNotificationSuccessAction(notifications))
    .catch(() => Observable.of(new fromNotification.FetchNotificationFailureAction()))
  )

  @Effect({ dispatch: false })
  fetchNotificationSuccess$ = this.actions$.ofType(fromNotification.FETCH_NOTIFICATION_SUCCESS)
  .do(() => {
    // this.toastService.show('查询日志成功')
  })

  @Effect({ dispatch: false })
  fetchNotificationFailure$ = this.actions$.ofType(fromNotification.FETCH_NOTIFICATION_FAILURE)
  .do(() => {
    // this.toastService.show('查询日志失败')
  })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private notificationService: NotificationService,
    private store: Store<State>
  ) {}
}
