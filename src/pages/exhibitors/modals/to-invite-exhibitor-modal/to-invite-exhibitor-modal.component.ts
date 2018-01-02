import { Component, OnInit } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'
import * as moment from 'moment'

import { FormControl } from '@angular/forms'
import { DestroyService } from '../../../../providers/destroy.service'

@Component({
  templateUrl: './to-invite-exhibitor-modal.component.html',
  providers: [DestroyService]
})
export class ToInviteExhibitorModal implements OnInit {
  addressCtrl: FormControl = new FormControl('')

  srcName: string
  destName: string
  srcAddress: string
  destAddress: string

  content: string

  private contentTpl = `{{destName}}，您于${moment().month() + 1}月${moment().date()}收到了` +
  `{{srcName}}的约请，TA希望在展位({{address}})上会面，请登录智慧会展系统(微信小程序)接受或拒绝。`

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private destroyService: DestroyService
  ) {}

  ngOnInit() {
    this.initFields()
    this.initSubscriber()
  }

  private initFields(): void {
    this.srcName = this.params.get('srcName')
    this.destName = this.params.get('destName')
    this.srcAddress = this.params.get('srcAddress')
    this.destAddress = this.params.get('destAddress')
    this.addressCtrl.patchValue(this.srcAddress)
  }

  private initSubscriber(): void {
    this.addressCtrl.valueChanges
      .startWith(this.srcAddress)
      .takeUntil(this.destroyService)
      .subscribe(address => {
        this.content = this.computeTpl(address)
      })
  }

  private computeTpl(address: string): string {
    return this.contentTpl.replace(/\{\{([^{}]*)\}\}/g, (_, c) => {
      if (c === 'address') {
        return address
      }
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
    this.dismiss(this.addressCtrl.value)
  }
}
