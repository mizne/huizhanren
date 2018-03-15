import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Exhibitor } from '../../models/exhibitor.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'exhibitor-item',
  templateUrl: 'exhibitor-item.component.html'
})
export class ExhibitorItemComponent implements OnInit {
  @Input() exhibitor: Exhibitor[]

  constructor() {}
  ngOnInit() {}
}
