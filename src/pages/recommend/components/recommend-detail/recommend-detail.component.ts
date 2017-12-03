import { Component, OnInit, Input } from '@angular/core'

import { Recommend, Portray, Customer } from '../../models/recommend.model'
import { Matcher } from '../../models/matcher.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'recommend-detail',
  templateUrl: 'recommend-detail.component.html'
})
export class RecommendDetailComponent implements OnInit {

  @Input() logs: Logger[]
  @Input() detail: Customer
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
