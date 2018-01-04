import { Component, Input, Output, EventEmitter } from '@angular/core'

import {
  Logger,
  LoggerLevel
} from '../../../pages/customer/models/logger.model'

@Component({
  selector: 'hz-logger-item',
  templateUrl: './logger-item.component.html'
})
export class HzLoggerItemComponent {
  @Input() log: Logger
  @Input() theme: string

  @Output() editLog: EventEmitter<Logger> = new EventEmitter<Logger>()

  get levelClass(): string {
    return this.log.level === LoggerLevel.INFO
      ? 'info'
      : this.log.level === LoggerLevel.WARN
        ? 'warn'
        : this.log.level === LoggerLevel.ERROR
          ? 'error'
          : this.log.level === LoggerLevel.SYS ? 'sys' : 'sys'
  }

  editLogger(log: Logger) {
    if (log.level !== LoggerLevel.SYS) {
      this.editLog.emit(log)
    }
  }
}
