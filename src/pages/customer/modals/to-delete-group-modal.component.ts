import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { State } from '../reducers/index'
import { 
  CancelDeleteGroupAction, 
  EnsureDeleteGroupAction
 } from '../actions/group.action'

 import { getSelectedCustomers } from '../reducers'

@Component({
  template: `
<div class="hz-modal to-delete-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      删除标签
    </ion-title>
    
  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    确定删除<span class="group-name">{{ groupName }}</span>这个标签么?
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

  .to-delete-modal .modal-body .group-name {
    color: #6288d5;
  }
`]
})
export class ToDeleteGroupModal {
  private groupName: string
  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController,
    private store: Store<State>
  ) {
    this.groupName = ` ${params.get('name')} `
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelDeleteGroupAction())
  }

  complete() {
    this.dismiss(true)
    this.store.dispatch(new EnsureDeleteGroupAction(this.params.get('id')))
  }
}
