import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-customer-abstract',
  templateUrl: 'customer-abstract.component.html',
})
export class HzCustomerAbstractComponent implements OnInit {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  @Input() detail: any

  constructor() {}

  ngOnInit() {
  }

  ensureInvite() {
    this.invite.emit()
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
