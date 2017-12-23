import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State } from '../reducers/index'
import {
  CancelDiscardAction,
  EnsureDiscardAction
 } from '../actions/customer.action'

@Component({
  template: `
<div class="hz-modal to-delete-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      放弃客户
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    确定放弃这个客户
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="cancel()">取消</button>
    <button type="button" class="hz-btn" (click)="complete()">确认</button>
  </div>
  </ion-content>
</div>
`,
styles: [`
  .modal-wrapper {
    height: 300px;
  }
  .to-delete-modal {
    height: 300px;
  }
  .to-delete-modal .modal-body {
    display: flex;
    align-items: center;
    font-size: 18px;
  }
`]
})
export class ToDiscardModal {
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
    this.store.dispatch(new CancelDiscardAction())
  }

  complete() {
    this.dismiss(true)
    this.store.dispatch(new EnsureDiscardAction())
  }
}
