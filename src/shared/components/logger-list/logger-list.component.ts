import { Component, Input, Output, EventEmitter } from '@angular/core'

import { Logger } from '../../../pages/customer/models/logger.model'

@Component({
  selector: 'hz-logger-list',
  templateUrl: './logger-list.component.html',
})
export class HzLoggerListComponent {
  @Input() logs: Logger[]
  @Input() theme: string

  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()
  @Output() editLog: EventEmitter<Logger> = new EventEmitter<Logger>()

  ensureCreateLog() {
    this.createLog.emit()
  }

  ensureEditLog(log: Logger) {
    debugger
    this.editLog.emit(log)
  }
}
