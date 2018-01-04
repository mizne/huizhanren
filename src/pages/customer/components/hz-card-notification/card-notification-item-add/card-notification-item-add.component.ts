import { Component, Input } from '@angular/core'

import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToCreateNotificationAction } from '../../../actions/notification.action'
import { Notification } from '../../../models/notification.model'

@Component({
  selector: 'hz-card-notification-item-add',
  template: `
    <div class="hz-card-notification-item-add" [ngClass]="[hasItem ? 'has-item' : '']">
      添加
      <ion-icon name="add-circle" tappable (click)="createNotification()"></ion-icon>
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
