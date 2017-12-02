import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Effect, Actions, toPayload } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { Storage } from '@ionic/storage'
import { ModalController, ToastController } from 'ionic-angular'

import * as fromVerifyCode from '../actions/verify-code.action'
import * as fromExhibitions from '../actions/exhibitions.action'
import { VerifyCodeModal } from '../verify-code-modal.component'
import { WelcomeModal } from '../welcome-modal.component'
import { LoginService } from '../../../providers/login.service'
import { SmsService } from '../../../providers/sms.service'

import { State, getPhone } from '../reducers/index'

@Injectable()
export class VerifyCodeEffects {
  @Effect()
  toVerifyCode$ = this.actions$
    .ofType(fromVerifyCode.TO_VERIFY_CODE)
    .map(toPayload)
    .mergeMap(phone => {
      return Observable.fromPromise(
        new Promise((res, rej) => {
          const verifyCodeModal = this.modalCtrl.create(VerifyCodeModal, {})
          verifyCodeModal.onDidDismiss((data) => {
            res(data)
          })
          verifyCodeModal.present()
        })
      ).map((data) => {
        if (data) {
          return new fromVerifyCode.VerifyCodeAction(data)
        } else {
          return new fromVerifyCode.CancelVerifyCodeAction()
        }
      })
    })

  @Effect()
  fetchCode$ = this.actions$
    .ofType(fromVerifyCode.FETCH_CODE)
    .withLatestFrom(this.store.select(getPhone))
    .mergeMap(([action, phone]) =>
      this.smsService
      .fetchVerifyCode(phone)
      .map(res => new fromVerifyCode.FetchCodeSuccessAction())
      .catch(err => Observable.of(new fromVerifyCode.FetchCodeFailureAction()))
    )

  @Effect({ dispatch: false })
  fetchCodeSuccess$ = this.actions$
    .ofType(fromVerifyCode.FETCH_CODE_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '验证码已发送, 请注意查收',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  fetchCodeFailure$ = this.actions$
    .ofType(fromVerifyCode.FETCH_CODE_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '验证码发送失败, 请重新获取',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  verifyCode$ = this.actions$
    .ofType(fromVerifyCode.VERIFY_CODE)
    .map(toPayload)
    .mergeMap(({ phone, code }) =>
      this.smsService
        .verifyCode(phone, code)
        .concatMap(() => [
          new fromVerifyCode.VerifyCodeSuccessAction({ phone, code }),
          new fromExhibitions.FetchAllExhibitionsAction(phone)
        ])
        .catch(err => Observable.of(new fromVerifyCode.VerifyCodeFailureAction()))
    )

  @Effect({ dispatch: false })
  verifyCodeSuccessAction$ = this.actions$
    .ofType(fromVerifyCode.VERIFY_CODE_SUCCESS)
    .map(toPayload)
    .do(({ phone }) => {
      this.storage.set(phone, true)
      this.storage.set('loginName', phone)
    })

  @Effect({ dispatch: false })
  verifyCodeFailure$ = this.actions$
    .ofType(fromVerifyCode.VERIFY_CODE_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '验证码填写错误',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loginService: LoginService,
    private smsService: SmsService,
    private storage: Storage,
    private store: Store<State>
  ) {}
}
