import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  templateUrl: './to-agree-matcher-modal.component.html',
})
export class ToAgreeMatcherModal {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
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
