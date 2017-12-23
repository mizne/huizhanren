import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'hz-customer-abstract',
  templateUrl: 'customer-abstract.component.html',
})
export class HzCustomerAbstractComponent {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  @Input() detail: any

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
