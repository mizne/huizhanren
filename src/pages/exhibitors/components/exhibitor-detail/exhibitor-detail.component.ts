import { Component, OnInit, Input } from '@angular/core'

import { Portray, Exhibitor } from '../../models/exhibitor.model'
import { Matcher } from '../../models/matcher.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'exhibitor-detail',
  templateUrl: 'exhibitor-detail.component.html'
})
export class ExhibitorDetailComponent implements OnInit {

  @Input() logs: Logger[]
  @Input() detail: Exhibitor
  @Input() portray: Portray
  @Input() expand: boolean

  activeHeaderIndex: number = 0
  activeDetailHeaderIndex: number = 0

  constructor() {}

  ngOnInit() {}

  activeHeader(index: number) {
    this.activeHeaderIndex = index
  }

  activeDetailHeader(index: number) {
    this.activeDetailHeaderIndex = index
  }
}
