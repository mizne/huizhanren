import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { Exhibitor, Product } from '../../models/exhibitor.model'

@Component({
  selector: 'hz-exhibitor-abstract',
  templateUrl: 'exhibitor-abstract.component.html'
})
export class HzExhibitorAbstractComponent implements OnInit {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Input() detail: Exhibitor

  @Output() showProduct: EventEmitter<Product> = new EventEmitter<Product>()

  ngOnInit() {}

  ensureInvite() {
    this.invite.emit()
  }

  ensureShowProduct(product: Product) {
    this.showProduct.emit(product)
  }
}
