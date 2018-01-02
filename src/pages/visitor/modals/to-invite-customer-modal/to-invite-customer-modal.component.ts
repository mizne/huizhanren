import { Component, OnInit } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'
import * as moment from 'moment'

@Component({
  templateUrl: './to-invite-customer-modal.component.html'
})
export class ToInviteCustomerModal implements OnInit {
  destName: string
  destTitle: string
  destCompany: string

  srcCompany: string
  boothNo: string
  content: string

  private contentTpl = `{{destName}}，您于${moment().month() + 1}月${moment().date()}日收到了` +
  `{{srcCompany}}的约请，TA希望在展位({{boothNo}})上会面，请去"我的约请"接受或拒绝。`

  constructor(public params: NavParams, public viewCtrl: ViewController) {}

  ngOnInit() {
    this.initFields()
  }

  private initFields(): void {
    this.destName = this.params.get('destName')
    this.destTitle = this.params.get('destTitle')
    this.destCompany = this.params.get('destCompany')
    this.srcCompany = this.params.get('srcCompany')
    this.boothNo = this.params.get('boothNo')
    this.content = this.computeTpl()
  }

  private computeTpl(): string {
    return this.contentTpl.replace(/\{\{([^{}]*)\}\}/g, (_, c) => {
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
