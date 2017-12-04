import { Component, ElementRef, OnInit } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

@Component({
  templateUrl: './to-invite-customer-modal.component.html',
})
export class ToInviteCustomerModal implements OnInit {
  destName: string
  destTitle: string
  destCompany: string

  srcCompany: string
  srcAddress: string
  content: string

  private contentTpl = '{{destName}}，您于12月4日收到了{{srcCompany}}的约请，' +
  'TA希望在展位({{srcAddress}})上会面，请去"我的约请"接受或拒绝。'

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {
    this.initFields()
  }

  private initFields(): void {
    this.destName = this.params.get('destName')
    this.destTitle = this.params.get('destTitle')
    this.destCompany = this.params.get('destCompany')
    this.srcCompany = this.params.get('srcCompany')
    this.srcAddress = this.params.get('srcAddress')
    this.content = this.computeTpl()
  }

  private computeTpl(): string {
    return this.contentTpl.replace(/\{\{([^{}]*)\}\}/g, (m, c) => {
      return this[c]
    })
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel(): void {
    this.dismiss()
  }

  complete() {
    this.dismiss(true)
  }
}
