import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getGroups } from '../reducers'
import { Group } from '../models/group.model'
import { CreateAction } from '../actions/group.action'
import { SingleEditGroupAction } from '../actions/customer.action'

@Component({
  template: `
  <div class="hz-modal edit-group-modal">
    <ion-header>
    <ion-toolbar>
      <ion-title>
        编辑标签
      </ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content>
    <div class="modal-body">
      <div class="create-group-area form-group">
        <div class="create-header">
          <ion-icon name="add-circle" color="primary"></ion-icon>
          <span class="create-text">新建标签</span>
        </div>

        <div class="create-content input-group">
          <input type="text" class="form-control" [(ngModel)]="groupName" placeholder="请输入标签名称">
          <button type="button" class="input-group-addon" (click)="createGroup()">确认</button>
        </div>
      </div>

      <div class="show-group-area">
        <div class="group-item" *ngFor="let group of groups$ | async" [class.active]="selectedGroup === group"
          (click)="selectGroup(group)">
          {{group.name}}
        </div>
      </div>

    </div>
    <div class="modal-footer">
      <button type="button" class="hz-btn" (click)="cancel()">取消</button>
      <button type="button" class="hz-btn" (click)="complete()">完成</button>
    </div>
    </ion-content>
  </div>
  `,
styles: [`
  .edit-group-modal {
    height: 410px;
  }

  .edit-group-modal .modal-body {
    padding: 20px 34px;
  }

  .edit-group-modal .modal-body .create-group-area {
    font-size: 16px;
    background-color: #ecf3fa;
    padding: 10px;
  }

  .edit-group-modal .modal-body .create-group-area .create-header {
    margin-bottom: 10px;
  }

  .edit-group-modal .modal-body .create-group-area button {
    background-color: #6288d5;
    color: white;
  }

  .edit-group-modal .modal-body .show-group-area {
    font-size: 16px;
    min-height: 100px;
    overflow: auto;
    display: flex;
    flex-flow: wrap;
  }

  .edit-group-modal .modal-body .show-group-area .group-item {
    margin-right: 10px;
    margin-top: 5px;
    border: 1px solid #2f5ebd;
    height: 26px;
    line-height: 26px;
    padding-left: 9px;
    padding-right: 9px;
    min-width: 62px;
    cursor: pointer;
    text-align: center;
    color: #6288d5;
    transition: all ease .5s;
  }

  .edit-group-modal .modal-body .show-group-area .group-item.active {
    color: white;
    background-color: #6288d5;
  }
`]
})
export class ToEditCustomerGroupModal {

  selectedGroup: Group
  groupName: string
  groups$: Observable<Group[]>

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private store: Store<State>,
  ) {
    this.groups$ = store.select(getGroups)
    .map((groups) => groups.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    )
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel(): void {
    this.dismiss()
  }

  complete() {
    if (!this.selectedGroup) {
      this.toastCtrl.create({
        message: '您还没有选择标签呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.store.dispatch(new SingleEditGroupAction(this.selectedGroup.id))
      this.dismiss(true)
    }
  }

  createGroup() {
    if (!this.groupName) {
      this.toastCtrl.create({
        message: '您还没有填写标签名称呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.store.dispatch(new CreateAction(this.groupName))
      this.groupName = ''
    }
  }

  selectGroup(group: Group) {
    this.selectedGroup = group
  }
}
