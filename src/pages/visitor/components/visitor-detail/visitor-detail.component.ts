import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Portray, Visitor } from '../../models/visitor.model'
import { Logger } from '../../../customer/models/logger.model'
import { VisitorMatcher } from '../../models/matcher.model'
import { phoneRe } from '../../../customer/services/utils'

@Component({
  selector: 'visitor-detail',
  templateUrl: 'visitor-detail.component.html'
})
export class VisitorDetailComponent implements OnInit {
  @Input() logs: Logger[]
  @Input() detail: VisitorMatcher
  @Input() portray: Portray
  @Input() expand: boolean

  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()
  @Output() editLog: EventEmitter<Logger> = new EventEmitter<Logger>()
  @Output() sendSMS: EventEmitter<string> = new EventEmitter<string>()

  activeHeaderIndex: number = 0
  activeDetailHeaderIndex: number = 0

  get isPhone() {
    return phoneRe.test(this.detail.toShow.mobile)
  }

  constructor() {}

  ngOnInit() {
    console.log(this.detail)
  }

  activeHeader(index: number) {
    this.activeHeaderIndex = index
  }

  activeDetailHeader(index: number) {
    this.activeDetailHeaderIndex = index
  }

  ensureCreateLog() {
    this.createLog.emit()
  }

  ensureEditLog(log: Logger) {
    this.editLog.emit(log)
  }

  ensureSendSMS() {
    this.sendSMS.emit(this.detail.toShow.mobile)
  }
}
