import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Exhibitor, Product } from '../../models/exhibitor.model'
import { ExhibitorMatcher } from '../../models/matcher.model'

@Component({
  selector: 'hz-exhibitor-abstract',
  templateUrl: 'exhibitor-abstract.component.html'
})
export class HzExhibitorAbstractComponent implements OnInit {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Input() exhibitor: Exhibitor
  @Input() matcher: ExhibitorMatcher

  @Output() showProduct: EventEmitter<Product> = new EventEmitter<Product>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  showMoreDesc: boolean

  ngOnInit() {
    this.showMoreDesc = false
  }

  toggleMoreDesc() {
    this.showMoreDesc = !this.showMoreDesc
  }

  ensureInvite() {
    this.invite.emit()
  }

  ensureShowProduct(product: Product) {
    this.showProduct.emit(product)
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
