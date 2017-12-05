import { Component, ElementRef, OnInit } from '@angular/core'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { FormControl } from '@angular/forms'
import { DestroyService } from '../../../../providers/destroy.service'

@Component({
  templateUrl: './to-show-product-modal.component.html',
  providers: [DestroyService]
})
export class ToShowProductModal implements OnInit {
  name: string
  remark: string
  pictures: string[]

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private destroyService: DestroyService
  ) {}

  ngOnInit() {
    this.name = this.params.get('name')
    this.remark = this.params.get('remark')
    this.pictures = this.params.get('pictures')
    console.log(this.pictures)
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
