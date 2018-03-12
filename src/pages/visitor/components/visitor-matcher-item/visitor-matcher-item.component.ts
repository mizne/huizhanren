import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Visitor } from '../../models/visitor.model'
import { Logger } from '../../../customer/models/logger.model'
import { VisitorMatcher } from '../../models/matcher.model';

@Component({
  selector: 'visitor-matcher-item',
  templateUrl: 'visitor-matcher-item.component.html'
})
export class VisitorMatcherItemComponent implements OnInit {
  @Input() matcher: VisitorMatcher[]
  @Output() invite: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}
  ngOnInit() {}

  ensureInvite(id: string) {
    this.invite.emit(id)
  }
}
