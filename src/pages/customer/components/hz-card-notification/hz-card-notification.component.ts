import { Component, Input } from '@angular/core';
import { ToastController } from 'ionic-angular'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getNotifications, getShowLog, getShowNotification } from '../../reducers'
import { ToggleShowLogAction, ToggleShowNotificationAction } from '../../actions/customer.action'
import { Notification } from '../../models/notification.model'

export { HzCardNotificationItemComponent } from './card-notification-item/card-notification-item.component'
export { HzCardNotificationItemAddComponent } from './card-notification-item-add/card-notification-item-add.component'

@Component({
  selector: 'hz-card-notification',
  template: `
    <div class="hz-card-notification" [class.close]="!open">
      <div class="hz-notification-title">
        <span class="hz-item" tappable [class.active]="showLog$ | async" (click)="toggleLog()">日志</span>
        <span class="hz-item" tappable [class.active]="showNotification$ | async" (click)="toggleNotification()">提醒</span>
        <span class="hz-item" tappable (click)="toggleAnasisy()">分析</span>
      </div>

      <div class="hz-notification-container">
        <hz-card-notification-item-add></hz-card-notification-item-add>
        <hz-card-notification-item *ngFor="let notification of notifications$ | async" [notification]="notification"></hz-card-notification-item>
        <p class="no-notification" *ngIf="(notifications$ | async).length === 0">还没有提醒呢</p>
      </div>
    </div>
  `
})
export class HzCardNotificationComponent {
  @Input()
  open: boolean
  notifications$: Observable<Notification[]>
  showLog$: Observable<boolean>
  showNotification$: Observable<boolean>

  constructor(
    private store: Store<State>,
    private toastCtrl: ToastController
  ) {
    this.notifications$ = store.select(getNotifications)
    this.showLog$ = store.select(getShowLog)
    this.showNotification$ = store.select(getShowNotification)
  }

  toggleLog() {
    this.store.dispatch(new ToggleShowLogAction(true))
  }

  toggleNotification() {
    this.store.dispatch(new ToggleShowNotificationAction(true))
  }

  toggleAnasisy() {
    this.toastCtrl.create({
      message: '吐血研发中',
      position: 'top',
      duration: 3e3
    }).present()
  }

}

