import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Exhibitor } from '../../models/exhibitor.model'
import { Logger } from '../../../customer/models/logger.model'
import {
  ExhibitorMatcher,
  ExhibitorMatcherStatus
} from '../../models/matcher.model'

@Component({
  selector: 'exhibitor-matcher-item',
  templateUrl: 'exhibitor-matcher-item.component.html'
})
export class ExhibitorMatcherItemComponent implements OnInit {
  AUDIT_SUCCEED = ExhibitorMatcherStatus.AUDIT_SUCCEED
  UN_AUDIT = ExhibitorMatcherStatus.UN_AUDIT
  AGREE = ExhibitorMatcherStatus.AGREE

  @Input() matcher: ExhibitorMatcher
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
