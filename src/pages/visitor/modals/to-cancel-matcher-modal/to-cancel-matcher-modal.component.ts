import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  templateUrl: './to-cancel-matcher-modal.component.html',
})
export class ToCancelMatcherModal {
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
