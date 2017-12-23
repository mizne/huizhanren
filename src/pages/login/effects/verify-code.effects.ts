import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Effect, Actions, toPayload } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { ModalController, ToastController } from 'ionic-angular'

import * as fromVerifyCode from '../actions/verify-code.action'
import * as fromExhibitions from '../actions/exhibitions.action'
import { VerifyCodeModal } from '../modals/verify-code-modal.component'
import { SmsService } from '../../../providers/sms.service'
import { TenantService } from '../../../providers/tenant.service'

import { State, getPhone } from '../reducers/index'

@Injectable()
export class VerifyCodeEffects {
  @Effect()
  toVerifyCode$ = this.actions$
    .ofType(fromVerifyCode.TO_VERIFY_CODE)
    .map(toPayload)
    .mergeMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
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
    .mergeMap(([_, phone]) =>
      this.smsService
      .fetchVerifyCode(phone)
      .map(() => new fromVerifyCode.FetchCodeSuccessAction())
      .catch(() => Observable.of(new fromVerifyCode.FetchCodeFailureAction()))
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
        .catch(() => Observable.of(new fromVerifyCode.VerifyCodeFailureAction()))
    )

  @Effect({ dispatch: false })
  verifyCodeSuccessAction$ = this.actions$
    .ofType(fromVerifyCode.VERIFY_CODE_SUCCESS)
    .map(toPayload)
    .do(({ phone }) => {
      this.tenantService.setLoginName(phone)
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
    private smsService: SmsService,
    private tenantService: TenantService,
    private store: Store<State>
  ) {}
}
