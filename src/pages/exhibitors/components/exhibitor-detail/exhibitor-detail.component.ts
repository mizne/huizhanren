import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { ToastController } from 'ionic-angular'

import { Portray, Exhibitor } from '../../models/exhibitor.model'
import { Matcher } from '../../models/matcher.model'
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
}
