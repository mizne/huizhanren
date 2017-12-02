import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { Effect, Actions, toPayload } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { Storage } from '@ionic/storage'
import { ModalController, ToastController, LoadingController } from 'ionic-angular'

import * as fromExhibitions from '../actions/exhibitions.action'
import { VerifyCodeModal } from '../verify-code-modal.component'
import { WelcomeModal } from '../welcome-modal.component'
import { LoginService } from '../../../providers/login.service'
import { SmsService } from '../../../providers/sms.service'

import { State, getPhone } from '../reducers/index'

@Injectable()
export class ExhibitionsEffects {
  @Effect()
  FetchAllExhibitions$ = this.actions$
    .ofType(fromExhibitions.FETCH_ALL_EXHIBITIONS)
    .map((action: fromExhibitions.FetchAllExhibitionsAction) => action.phone)
    .mergeMap(phone => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取展会信息中...',
        spinner: 'bubbles'
      })

      loadingCtrl.present()
      return this.loginService
        .fetchExhibitionsAndLogin(phone)
        .concatMap(res => {
          loadingCtrl.dismiss()
          return [
            new fromExhibitions.FetchAllExhibitionsSuccessAction(res),
            new fromExhibitions.ToWelcomeAction()
          ]
        })
        .catch(err => {
          loadingCtrl.dismiss()
          return Observable.of(new fromExhibitions.FetchAllExhibitionsFailureAction())
        })
    })

  @Effect({ dispatch: false })
  fetchAllExhibitionsFailure$ = this.actions$
    .ofType(fromExhibitions.FETCH_ALL_EXHIBITIONS_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '未绑定该手机号',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  toWelcome$ = this.actions$.ofType(fromExhibitions.TO_WELCOME).mergeMap(() => {
    return Observable.fromPromise(
      new Promise((res, rej) => {
        const welcomeModal = this.modalCtrl.create(WelcomeModal, {})
        welcomeModal.onDidDismiss(text => {
          res(text)
        })

        welcomeModal.present()
      })
    )
  })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private loginService: LoginService,
    private smsService: SmsService,
    private storage: Storage,
    private store: Store<State>
  ) {}
}
