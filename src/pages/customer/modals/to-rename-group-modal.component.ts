import { Component, ElementRef } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getGroups } from '../reducers'
import { Group } from '../models/group.model'
import { CreateAction, EnsureRenameGroupAction } from '../actions/group.action'

@Component({
  template: `
  <div class="hz-modal edit-group-modal">
    <ion-header>
    <ion-toolbar>
      <ion-title>
        重命名标签
      </ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content>
    <div class="modal-body">
      <div class="create-group-area form-group">

        <div class="create-content input-group">
          <input type="text" class="form-control" [(ngModel)]="groupName" placeholder="请输入标签名称">
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
    padding: 10px;
    margin-top: 60px;
  }

  .edit-group-modal .modal-body .create-group-area .create-header {
    margin-bottom: 10px;
  }

  .edit-group-modal .modal-body .create-group-area button {
    background-color: #6288d5;
    color: white;
  }
`]
})
export class ToRenameGroupModal {

  private groupName: string
  private originalName: string

  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController, 
    private toastCtrl: ToastController,
    private store: Store<State>,
  ) {
    this.originalName = params.get('name')
    this.groupName = params.get('name')
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel(): void {
    this.dismiss()
  }

  complete() {
    if (!this.groupName) {
      this.toastCtrl.create({
        message: '您还没有填写标签名称呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else if (this.groupName === this.originalName) {
      this.toastCtrl.create({
        message: '标签名称未更改',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.store.dispatch(new EnsureRenameGroupAction({
        id: this.params.get('id'),
        name: this.groupName
      }))
      this.dismiss(true)
    }
  }
}
