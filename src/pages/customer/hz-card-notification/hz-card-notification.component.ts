import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State, getNotifications, getShowLog, getShowNotification } from '../reducers'
import { ToCreateNotificationAction, ToEditNotificationAction } from '../actions/notification.action'
import { ToggleShowLogAction, ToggleShowNotificationAction } from '../actions/customer.action'
import { Observable } from 'rxjs/Observable'

import { Notification } from '../models/notification.model'

@Component({
  selector: 'hz-card-notification',
  template: `
    <div class="hz-card-notification" [class.close]="!open">
      <div class="hz-notification-title">
        <span class="hz-item" [class.active]="showLog$ | async" (click)="toggleLog()">日志</span>
        <span class="hz-item" [class.active]="showNotification$ | async" (click)="toggleNotification()">提醒</span>
        <span class="hz-item" (click)="toggleAnasisy()">分析</span>
      </div>

      <div class="hz-notification-container">
        <hz-card-notification-item-add></hz-card-notification-item-add>
        <hz-card-notification-item *ngFor="let notification of notifications$ | async" [notification]="notification"></hz-card-notification-item>
        <p class="no-notification" *ngIf="(notifications$ | async).length === 0">还没有提醒呢</p>
      </div>
    </div>
  `,
  styles: [`
  .hz-card-notification .hz-notification-title {
    width: 100%;
    display: flex;
  }

  .hz-card-notification .hz-notification-title .hz-item {
    flex: 1;
    text-align: center;
  }

  .hz-card-notification .hz-notification-title .hz-item.active {
    background-color: #6287d5;
  }
  `]
})
export class HzCardNotificationComponent implements OnInit {
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

  ngOnInit() { }

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

@Component({
  selector: 'hz-card-notification-item',
  template: `
    <div class="hz-card-notification-item">
      <div class="hz-card-notification-time">
        {{notification.time}}
      </div>
      <div class="hz-card-notification-content" (click)="editNotification(notification)">
        {{notification.content}}
      </div>
    </div>
  `,
  styles: [`
    .hz-card-notification-item {
      position: relative;
      min-height: 57px;
      padding-bottom: 20px;
      padding-left: 35px;
    }

    .hz-card-notification-item:before {
      position: absolute;
      top: 2px;
      left: 3px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 13px;
      height: 13px;
      content: '';
      border-radius: 50%;
      background: #fff;
    }

    .hz-card-notification-item:after {
      position: absolute;
      top: 7px;
      left: 9px;
      width: 1px;
      height: 100%;
      content: '';
      background: rgba(245, 247, 252, 0.51);
    }

    .hz-card-notification-item .hz-card-notification-time {
      margin-bottom: 5px;
      font-size: 12px;
    }

    .hz-card-notification-item .hz-card-notification-content {
      display: inline-block;
      min-height: 42px;
      padding: 12px 15px 8px;
      border-radius: 4px;
      background: #6190ec;
    }
  `]
})
export class HzCardNotificationItemComponent implements OnInit {

  @Input() notification: Notification

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
  }

  editNotification(notification: Notification) {
    this.store.dispatch(new ToEditNotificationAction(notification))
  }
}

@Component({
  selector: 'hz-card-notification-item-add',
  template: `
    <div class="hz-card-notification-item-add hz-card-notification-item">
      添加
      <ion-icon name="add-circle" (click)="createNotification()"></ion-icon>
    </div>
  `,
  styles: [`
    .hz-card-notification-item {
      position: relative;
      display: flex;
      min-height: 57px;
      padding-bottom: 20px;
      padding-left: 35px;
    }

    .hz-card-notification-item ion-icon {
      font-size: 20px;
      margin-left: 7px;
    }

    .hz-card-notification-item:before {
      position: absolute;
      top: 2px;
      left: 3px;
      box-sizing: content-box;
      width: 13px;
      height: 13px;
      content: '';
      border-radius: 50%;
      background: #fff;
    }

    .hz-card-notification-item:after {
      position: absolute;
      top: 7px;
      left: 9px;
      width: 1px;
      height: 100%;
      content: '';
      background: rgba(245, 247, 252, 0.51);
    }

    .hz-card-notification-item-add:before {
      left: 0;
      width: 13px;
      height: 13px;
      border: 3px solid rgba(108, 140, 220, 0.51);
    }
  `]
})
export class HzCardNotificationItemAddComponent implements OnInit {

  @Input() notification: any

  constructor(
    private store: Store<State>
  ) {

  }

  ngOnInit() {
  }

  createNotification() {
    this.store.dispatch(new ToCreateNotificationAction())
  }
}
