import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  selector: 'to-download-modal',
  templateUrl: 'to-download-modal.component.html'
})

export class ToDownloadModal {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  ensure() {
    this.dismiss()
  }
}
