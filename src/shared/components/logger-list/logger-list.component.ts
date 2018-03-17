import { Component, Input, Output, EventEmitter } from '@angular/core'

import { ContactLogger } from '../../../pages/customer/models/logger.model'

@Component({
  selector: 'hz-logger-list',
  templateUrl: './logger-list.component.html',
})
export class HzLoggerListComponent {
  @Input() logs: ContactLogger[]
  @Input() theme: string

  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()
  @Output() editLog: EventEmitter<ContactLogger> = new EventEmitter<ContactLogger>()

  ensureCreateLog() {
    this.createLog.emit()
  }

  ensureEditLog(log: ContactLogger) {
    this.editLog.emit(log)
  }
}
