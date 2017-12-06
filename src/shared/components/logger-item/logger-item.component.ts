import { Component, Input } from '@angular/core'

import { Logger } from '../../../pages/customer/models/logger.model'

@Component({
  selector: 'hz-logger-item',
  templateUrl: './logger-item.component.html',
})
export class HzLoggerItemComponent {
  @Input() log: Logger
  @Input() theme: string
}
