import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  templateUrl: './to-refuse-matcher-modal.component.html',
})
export class ToRefuseMatcherModal {
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
