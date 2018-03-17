import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { ModalController, LoadingController } from 'ionic-angular'

import * as fromExhibitions from '../actions/exhibitions.action'
import { ToastService } from '../../../providers/toast.service'
import { WelcomeModal } from '../modals/welcome-modal.component'
import { LoginService } from '../../../providers/login.service'

@Injectable()
export class ExhibitionsEffects {
  @Effect()
  FetchAllExhibitions$ = this.actions$
    .ofType(fromExhibitions.FETCH_ALL_EXHIBITIONS)
    .map((action: fromExhibitions.FetchAllExhibitionsAction) => action.phone)
    .switchMap(phone => {
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
        .catch(e => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromExhibitions.FetchAllExhibitionsFailureAction(e.message)
          )
        })
    })

  @Effect({ dispatch: false })
  fetchAllExhibitionsFailure$ = this.actions$
    .ofType(fromExhibitions.FETCH_ALL_EXHIBITIONS_FAILURE)
    .map(
      (action: fromExhibitions.FetchAllExhibitionsFailureAction) =>
        action.errorMsg
    )
    .do(msg => {
      this.toastService.show(msg)
    })

  @Effect({ dispatch: false })
  toWelcome$ = this.actions$
    .ofType(fromExhibitions.TO_WELCOME)
    .switchMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
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
    private toastService: ToastService,
    private loadCtrl: LoadingController,
    private loginService: LoginService
  ) {}
}
