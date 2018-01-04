import { Component, Input } from '@angular/core'
import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToEditNotificationAction } from '../../../actions/notification.action'
import { Notification } from '../../../models/notification.model'

@Component({
  selector: 'hz-card-notification-item',
  template: `
    <div class="hz-card-notification-item" [class.expired]="notification.expired">
      <div class="hz-card-notification-time">
        {{notification.time}}
      </div>
      <div class="hz-card-notification-content" tappable (click)="editNotification(notification)">
        {{notification.content}}
      </div>
    </div>
  `
})
export class HzCardNotificationItemComponent {
  @Input() notification: Notification
  constructor(private store: Store<State>) {
  }

  editNotification(notification: Notification) {
    this.store.dispatch(new ToEditNotificationAction(notification))
  }
}
