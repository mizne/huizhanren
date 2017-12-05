import { Component, ElementRef, OnInit } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

@Component({
  templateUrl: './to-refuse-matcher-modal.component.html',
})
export class ToRefuseMatcherModal implements OnInit {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
  ) {
  }

  ngOnInit() {
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
