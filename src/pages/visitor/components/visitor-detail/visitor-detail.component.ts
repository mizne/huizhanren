import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Visitor } from '../../models/visitor.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'visitor-detail',
  templateUrl: 'visitor-detail.component.html'
})
export class VisitorDetailComponent implements OnInit {

  @Input() logs: Logger[]
  @Input() detail: Visitor
  @Input() portray: Portray
  @Input() expand: boolean

  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

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

  ensureInvite() {
    this.invite.emit()
  }

  ensureCreateLog() {
    this.createLog.emit()
  }

  ensureCancelMatcher(id: string) {
    this.cancelMatcher.emit(id)
  }

  ensureAgreeMatcher(id: string) {
    this.agreeMatcher.emit(id)
  }

  ensureRefuseMatcher(id: string) {
    this.refuseMatcher.emit(id)
  }
}
