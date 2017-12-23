import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State } from '../reducers/index'
import { FetchSMSCodeAction, EnsureAddUserAction, CancelAddUserAction } from '../actions/user-management.action'

@Component({
  template: `
<div class="hz-modal hz-add-user-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      添加用户
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    <div class="form-layer">
      <div class="form-group">
        <div class="input-group">
          <input type="text" class="form-control" [(ngModel)]="name" placeholder="请输入用户姓名">
        </div>
        <div class="input-group">
          <input type="text" class="form-control" [(ngModel)]="phone" placeholder="请输入手机号">
        </div>
        <div class="input-group">
          <input type="text" class="form-control" [(ngModel)]="code" placeholder="验证码">
          <button type="button" class="input-group-addon" (click)="fetchCode()">获取验证码</button>
        </div>
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
  .hz-add-user-modal {
    height: 400px;
  }
  .hz-add-user-modal .modal-body {
    font-size: 18px;
  }

  .hz-add-user-modal .modal-body .input-group {
    margin-bottom: 20px;
    margin-top: 10px;
  }
`]
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
