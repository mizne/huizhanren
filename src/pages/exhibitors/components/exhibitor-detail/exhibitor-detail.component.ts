import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ToastController } from 'ionic-angular'

import { Portray, Exhibitor, Product } from '../../models/exhibitor.model'
import { ExhibitorMatcher } from '../../models/matcher.model'
import { Logger } from '../../../customer/models/logger.model'

@Component({
  selector: 'exhibitor-detail',
  templateUrl: 'exhibitor-detail.component.html'
})
export class ExhibitorDetailComponent implements OnInit {

  @Input() logs: Logger[]
  @Input() detail: Exhibitor
  @Input() portray: Portray
  @Input() expand: boolean

  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Output() createLog: EventEmitter<void> = new EventEmitter<void>()
  @Output() showProduct: EventEmitter<Product> = new EventEmitter<Product>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  activeHeaderIndex: number = 0
  activeDetailHeaderIndex: number = 0

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {}

  activeHeader(index: number) {
    if (index === 1) {
      return this.toastCtrl.create({
        message: '吐血研发中',
        position: 'top',
        duration: 3e3
      }).present()
    }
    this.activeHeaderIndex = index

  }

  activeDetailHeader(index: number) {
    if (index === 1) {
      return this.toastCtrl.create({
        message: '吐血研发中',
        position: 'top',
        duration: 3e3
      }).present()
    }
    this.activeDetailHeaderIndex = index
  }

  ensureInvite() {
    this.invite.emit()
  }

  ensureCreateLogger() {
    this.createLog.emit()
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
