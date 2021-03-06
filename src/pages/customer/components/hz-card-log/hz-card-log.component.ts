import { Component, Input } from '@angular/core'
import { ToastController } from 'ionic-angular'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getLogs, getShowLog, getShowNotification } from '../../reducers'
import {
  ToggleShowLogAction,
  ToggleShowNotificationAction
} from '../../actions/customer.action'
import { ContactLogger } from '../../models/logger.model'
import {
  ToCreateLoggerAction,
  ToEditLoggerAction
} from '../../actions/logger.action'

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
        <hz-logger-list theme="primary" [logs]="logs$ | async"
          (createLog)="ensureCreateLog()"
          (editLog)="ensureEditLog($event)"
          >
        </hz-logger-list>
      </div>
    </div>
  `
})
export class HzCardLogComponent {
  @Input() open: boolean
  logs$: Observable<ContactLogger[]>
  showLog$: Observable<boolean>
  showNotification$: Observable<boolean>

  constructor(private store: Store<State>, private toastCtrl: ToastController) {
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
    this.toastCtrl
      .create({
        message: '吐血研发中...',
        duration: 3e3,
        position: 'top'
      })
      .present()
  }

  ensureCreateLog() {
    this.store.dispatch(new ToCreateLoggerAction())
  }

  ensureEditLog(log: ContactLogger) {
    this.store.dispatch(new ToEditLoggerAction(log))
  }
}
