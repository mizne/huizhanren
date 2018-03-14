import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Visitor } from '../../models/visitor.model'
import { Logger } from '../../../customer/models/logger.model'
import {
  VisitorMatcher,
  VisitorMatcherStatus
} from '../../models/matcher.model'

@Component({
  selector: 'visitor-matcher-item',
  templateUrl: 'visitor-matcher-item.component.html'
})
export class VisitorMatcherItemComponent implements OnInit {
  AUDIT_SUCCEED = VisitorMatcherStatus.AUDIT_SUCCEED
  UN_AUDIT = VisitorMatcherStatus.UN_AUDIT
  AGREE = VisitorMatcherStatus.AGREE

  @Input() matcher: VisitorMatcher[]
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}
  ngOnInit() {
    console.log(this.matcher)
  }

  ensureAgreeMatcher(id: string) {
    this.agreeMatcher.emit(id)
  }

  ensureRefuseMatcher(id: string) {
    this.refuseMatcher.emit(id)
  }
}
