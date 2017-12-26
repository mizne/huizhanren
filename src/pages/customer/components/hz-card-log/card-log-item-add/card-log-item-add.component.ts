import { Component, Input } from '@angular/core'

import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToCreateLoggerAction } from '../../../actions/logger.action'

@Component({
  selector: 'hz-card-log-item-add',
  template: `
    <div class="hz-card-log-item-add">
      添加
      <ion-icon name="add-circle" tappable (click)="createLogger()"></ion-icon>
    </div>
  `
})
export class HzCardLogItemAddComponent {
  @Input() log: any

  constructor(private store: Store<State>) {}

  createLogger() {
    this.store.dispatch(new ToCreateLoggerAction())
  }
}
