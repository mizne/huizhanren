import { Component, OnDestroy } from '@angular/core'
import { NavParams, ViewController } from 'ionic-angular'

import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { State } from '../reducers/index'
import {
  CancelDeleteAction,
  EnsureDeleteAction
} from '../actions/customer.action'

import { getSelectedCustomers } from '../reducers'

@Component({
  template: `
<div class="hz-modal to-delete-modal hz-confirm-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      {{ deleteMulti ? '批量删除客户' : '删除客户' }}
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    {{ deleteMulti ? '确定删除选择的' + count + '条数据?' : '确定删除此客户?' }}
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="cancel()">取消</button>
    <button type="button" class="hz-btn" (click)="complete()">确认</button>
  </div>
  </ion-content>
</div>
`
})
export class ToDeleteCustomerModal implements OnDestroy {
  deleteMulti: boolean
  count: number

  private subscription: Subscription
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private store: Store<State>
  ) {
    this.deleteMulti = !!params.get('multi')

    this.subscription = store
      .select(getSelectedCustomers)
      .map(e => e.length)
      .subscribe(count => {
        this.count = count
      })
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelDeleteAction())
  }

  complete() {
    this.dismiss(true)
    this.store.dispatch(new EnsureDeleteAction(!!this.deleteMulti))
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
