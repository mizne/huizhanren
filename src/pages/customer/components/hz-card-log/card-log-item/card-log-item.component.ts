import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store'
import { State } from '../../../reducers'
import { ToEditLoggerAction } from '../../../actions/logger.action'
import { Logger, LoggerLevel } from '../../../models/logger.model'

@Component({
  selector: 'hz-card-log-item',
  template: `
    <div class="hz-card-log-item">
      <div class="hz-card-log-time">
        {{log.time}}
      </div>
      <div class="hz-card-log-content" tappable [ngClass]="levelClass" (click)="editLogger(log)">
        {{log.content}}
      </div>
    </div>
  `
})
export class HzCardLogItemComponent {
  @Input() log: Logger

  get levelClass(): string {
    return this.log.level === LoggerLevel.INFO ?
    'info' : this.log.level === LoggerLevel.WARN ?
    'warn': this.log.level === LoggerLevel.ERROR ?
    'error': this.log.level === LoggerLevel.SYS ?
    'sys' : 'sys'
  }

  constructor(private store: Store<State>) {
  }

  editLogger(log: Logger) {
    if (log.level !== LoggerLevel.SYS) {
      this.store.dispatch(new ToEditLoggerAction(log))
    }
  }
}
