import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { Logger } from '../logger-item/logger-item.component'

@Component({
  selector: 'hz-logger-list',
  templateUrl: './logger-list.component.html',
})
export class HzLoggerListComponent {
  @Input() logs: Logger[]

  @Input() theme: string

  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()

  constructor() {}
  ngOnInit() {
  }

  ensureCreateLog() {
    console.log('ensure create log')
    this.createLog.emit()
  }
}
