import { Component } from '@angular/core'
import {
  IonicPage,
  ToastController,
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State } from './reducers/index'
import {
  ToVerifyCodeAction,
  VerifyCodeSuccessAction
} from './actions/verify-code.action'

import { FetchAllExhibitionsAction } from './actions/exhibitions.action'
import { TenantService } from '../../providers/tenant.service'
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

  phone: string = ''

  constructor(
    private toastCtrl: ToastController,
    private store: Store<State>,
    private tenantService: TenantService
  ) {}

  ionViewDidLoad() {
    this.tenantService.getLoginName()
    .then((name) => {
      if (name) {
        this.phone = name
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
    this.tenantService.hasVerify(this.phone)
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
