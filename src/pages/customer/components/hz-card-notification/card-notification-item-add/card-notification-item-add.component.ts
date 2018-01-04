import { Component, Input } from '@angular/core'

import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToCreateNotificationAction } from '../../../actions/notification.action'
import { Notification } from '../../../models/notification.model'

@Component({
  selector: 'hz-card-notification-item-add',
  template: `
    <div class="hz-card-notification-item-add primary" [ngClass]="[hasItem ? 'has-item' : '']">
      <span class="text">添加</span>
      <i class="iconfont icon-add-circle" tappable (click)="createNotification()"></i>
    </div>
  `
})
export class HzCardNotificationItemAddComponent {
  @Input() notification: Notification
  @Input() hasItem: boolean

  constructor(private store: Store<State>) {}

  createNotification() {
    this.store.dispatch(new ToCreateNotificationAction())
  }
}
