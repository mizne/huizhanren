import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'hz-logger-item-add',
  templateUrl: './logger-item-add.component.html'
})
export class HzLoggerItemAddComponent {
  @Input() theme: string
  @Input() hasLog: boolean
  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()

  createLogger() {
    this.createLog.emit()
  }
}
