import { Component } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'

@Component({
  templateUrl: './to-batch-agree-matcher-modal.component.html'
})
export class ToBatchAgreeMatchersModal {
  count: number
  constructor(public params: NavParams, public viewCtrl: ViewController) {
    console.log(params.get('count'))
    this.count = params.get('count')
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
