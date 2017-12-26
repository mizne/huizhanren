import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToEditLoggerAction } from '../../../actions/logger.action'
import { Logger } from '../../../models/logger.model'

@Component({
  selector: 'hz-card-log-item',
  template: `
    <div class="hz-card-log-item">
      <div class="hz-card-log-time">
        {{log.time}}
      </div>
      <div class="hz-card-log-content" tappable [ngClass]="log.level" (click)="editLogger(log)">
        {{log.content}}
      </div>
    </div>
  `
})
export class HzCardLogItemComponent {
  @Input() log: Logger

  constructor(private store: Store<State>) {
  }

  editLogger(log: Logger) {
    if (log.level !== 'sys') {
      this.store.dispatch(new ToEditLoggerAction(log))
    }
  }
}
