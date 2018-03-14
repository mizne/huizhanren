import { Component, OnInit } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'
import * as moment from 'moment'

@Component({
  templateUrl: './to-invite-visitor-modal.component.html'
})
export class ToInviteVisitorModal implements OnInit {
  constructor(public params: NavParams, public viewCtrl: ViewController) {}

  ngOnInit() {}

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
