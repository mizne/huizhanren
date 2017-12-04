import { Component, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-logger-item-add',
  templateUrl: './logger-item-add.component.html'
})
export class HzLoggerItemAddComponent {
  @Input() theme: string

  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()

  constructor() {}
  ngOnInit() {}

  createLogger() {
    console.log('to create logger')
    this.createLog.emit()
  }
}
