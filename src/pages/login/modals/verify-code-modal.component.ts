import { Component, OnDestroy } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { FetchCodeAction } from '../actions/verify-code.action'
import {
  State,
  getPhone
} from '../reducers/index'

@Component({
  template: `
<div class="hz-modal hz-verify-code-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      验证码
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    <div class="organize">
      <span class="organize-label">手机号：</span>
      <span class="organize-value">{{phone$ | async}}</span>
    </div>

    <div class="form-layer">
      <div class="form-group">
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
  .hz-verify-code-modal {
    height: 450px;
  }
`]
})
export class VerifyCodeModal implements OnDestroy {
  private phone$: Observable<string>
  private code: string

  private subscription: Subscription

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private store: Store<State>
  ) {
    this.phone$ = store.select(getPhone)
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    if (!this.code) {
      this.toastCtrl.create({
        message: '还没有填写验证码呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.subscription = this.phone$.subscribe((phone) => {
        this.dismiss({
          phone: phone,
          code: this.code
        })
      })
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  fetchCode() {
    this.store.dispatch(new FetchCodeAction())
  }
}
