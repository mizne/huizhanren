import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Visitor } from '../../models/visitor.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'visitor-item',
  templateUrl: 'visitor-item.component.html'
})
export class VisitorItemComponent implements OnInit {
  @Input() visitor: Visitor[]
  @Output() invite: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}
  ngOnInit() {}

  ensureInvite(id: string) {
    this.invite.emit(id)
  }
}
