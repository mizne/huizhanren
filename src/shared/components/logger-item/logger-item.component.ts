import { Component, Input, Output, EventEmitter } from '@angular/core'

import {
  ContactLogger,
  ContactLoggerLevel
} from '../../../pages/customer/models/logger.model'

@Component({
  selector: 'hz-logger-item',
  templateUrl: './logger-item.component.html'
})
export class HzLoggerItemComponent {
  @Input() log: ContactLogger
  @Input() theme: string

  @Output() editLog: EventEmitter<ContactLogger> = new EventEmitter<ContactLogger>()

  get levelClass(): string {
    return this.log.level === ContactLoggerLevel.INFO
      ? 'info'
      : this.log.level === ContactLoggerLevel.WARN
        ? 'warn'
        : this.log.level === ContactLoggerLevel.ERROR
          ? 'error'
          : this.log.level === ContactLoggerLevel.SYS ? 'sys' : 'sys'
  }

  editLogger(log: ContactLogger) {
    if (log.level !== ContactLoggerLevel.SYS) {
      this.editLog.emit(log)
    }
  }
}
