import { Component } from '@angular/core'
import {
  IonicPage,
  ToastController,
} from 'ionic-angular'
import { Storage } from '@ionic/storage'

import { Store } from '@ngrx/store'
import { State } from './reducers/index'
import { 
  ToVerifyCodeAction, 
  VerifyCodeSuccessAction
} from './actions/verify-code.action'

import { FetchAllExhibitionsAction } from './actions/exhibitions.action'
/**
 * Generated class for the LoginPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  // private phone: string = '13585130223'
  private phone: string = ''

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private store: Store<State>,
  ) {}

  ionViewDidLoad() {
    this.storage.get('loginName')
    .then(s => {
      if (s) {
        this.phone = s
      }
    })
  }

  toFetchCode() {
    if (!this.phone) {
      return this.toastCtrl.create({
        message: '您还没有填写手机号呢',
        duration: 3e3,
        position: 'top'
      }).present()
    }

    // 如果此手机号已验证过 则直接登录 无需再次验证
    this.storage.get(this.phone)
    .then(hasVerify => {
      if (hasVerify) {
        this.store.dispatch(new VerifyCodeSuccessAction({
          phone: this.phone,
          code: ''
        }))
        this.store.dispatch(new FetchAllExhibitionsAction(this.phone))
      } else {
        this.store.dispatch(new ToVerifyCodeAction(this.phone))
      }
    })
  }
}
