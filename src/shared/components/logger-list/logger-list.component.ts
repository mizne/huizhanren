import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { Logger } from '../logger-item/logger-item.component'

@Component({
  selector: 'hz-logger-list',
  templateUrl: './logger-list.component.html',
})
export class HzLoggerListComponent {
  @Input() logs: Logger[]

  @Input() theme: string

  constructor() {}
  ngOnInit() {
  }
}
