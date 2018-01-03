import { Component } from '@angular/core';
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State } from '../../reducers/index'
import {
  CancelDeleteUserAction,
  EnsureDeleteUserAction
 } from '../../actions/user-management.action'

@Component({
  selector: 'to-delete-user-modal',
  templateUrl: 'to-delete-user-modal.component.html'
})

export class ToDeleteUserModal {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private store: Store<State>
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelDeleteUserAction())
  }

  complete() {
    this.dismiss(true)
    this.store.dispatch(new EnsureDeleteUserAction(this.params.get('userId')))
  }
}
