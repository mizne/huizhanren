import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  selector: 'to-logout-modal',
  templateUrl: 'to-logout-modal.component.html'
})

export class ToLogoutModal {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    this.dismiss(true)
  }
}
