import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State } from '../../reducers/index'
import { FetchSMSCodeAction, EnsureAddUserAction, CancelAddUserAction } from '../../actions/user-management.action'

@Component({
  selector: 'to-add-user-modal',
  templateUrl: 'to-add-user-modal.component.html'
})

export class ToAddUserModal {
  private name: string
  private phone: string
  private code: string

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private store: Store<State>,
    private toastCtrl: ToastController
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelAddUserAction())
  }

  complete() {
    if (!(this.name && this.phone && this.code)) {
      this.toastCtrl.create({
        message: '还没有填写完呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.dismiss(true)
      this.store.dispatch(new EnsureAddUserAction({
        name: this.name,
        phone: this.phone,
        code: this.code
      }))
    }
  }

  fetchCode() {
    if (!this.phone) {
      this.toastCtrl.create({
        message: '您还没有填写手机号呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.store.dispatch(new FetchSMSCodeAction(this.phone))
    }
  }
}
