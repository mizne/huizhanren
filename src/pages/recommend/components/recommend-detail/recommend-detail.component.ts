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

  constructor() {}

  ngOnInit() {}
}
