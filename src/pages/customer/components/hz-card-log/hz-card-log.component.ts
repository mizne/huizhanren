import { Component, Input } from '@angular/core'
import { ToastController } from 'ionic-angular'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getLogs, getShowLog, getShowNotification } from '../../reducers'
import {
  ToggleShowLogAction,
  ToggleShowNotificationAction
} from '../../actions/customer.action'
import { Logger } from '../../models/logger.model'

export { HzCardLogItemComponent } from './card-log-item/card-log-item.component'
export {
  HzCardLogItemAddComponent
} from './card-log-item-add/card-log-item-add.component'

@Component({
  selector: 'hz-card-log',
  template: `
    <div class="hz-card-log" [class.close]="!open">
      <div class="hz-log-title">
        <span class="hz-item" tappable [class.active]="showLog$ | async" (click)="toggleLog()">日志</span>
        <span class="hz-item" tappable [class.active]="showNotification$ | async" (click)="toggleNotification()">提醒</span>
        <span class="hz-item" tappable (click)="toggleAnasisy()">分析</span>
      </div>

      <div class="hz-log-container">
        <hz-card-log-item-add></hz-card-log-item-add>
        <hz-card-log-item *ngFor="let log of logs$ | async" [log]="log"></hz-card-log-item>
        <p class="no-log" *ngIf="(logs$ | async).length === 0">还没有日志呢</p>
      </div>
    </div>
  `
})
export class HzCardLogComponent {
  @Input() open: boolean

  logs$: Observable<Logger[]>

  showLog$: Observable<boolean>
  showNotification$: Observable<boolean>

  constructor(
    private store: Store<State>,
    private toastCtrl: ToastController
  ) {
    this.logs$ = store.select(getLogs)

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
      message: '吐血研发中...',
      duration: 3e3,
      position: 'top'
    }).present()
  }
}
