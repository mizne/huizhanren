import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

export interface Logger {
  id?: string
  time?: string
  level: LoggerLevel
  content: string
}
export type LoggerLevel = 'info' | 'warn' | 'error' | 'sys'

@Component({
  selector: 'hz-logger-item',
  templateUrl: './logger-item.component.html',
})
export class HzLoggerItemComponent {
  @Input() log: Logger

  @Input() theme: string

  constructor() {}
  ngOnInit() {
  }
}
