import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'

import { Observable } from 'rxjs/Observable';

import {
  ToastController,
  LoadingController
} from 'ionic-angular'

import * as other from '../actions/other.action'
import { OtherService } from '../services/other.service'

@Injectable()
export class OtherEffects {
  @Effect()
  checkUpdate$ = this.actions$.ofType(other.CHECK_UPDATE).mergeMap(() => {
    const loadingCtrl = this.loadCtrl.create({
      content: '检查更新中...',
      spinner: 'bubbles'
    })

    loadingCtrl.present()
    return this.otherService
      .checkUpdate()
      .map((updateText) => {
        loadingCtrl.dismiss()
        return new other.CheckUpdateSuccessAction(updateText)
      })
      .catch(() => {
        loadingCtrl.dismiss()
        return Observable.of(new other.CheckUpdateFailureAction())
      })
  })

  @Effect({ dispatch: false })
  checkUpdateSuccess$ = this.actions$
    .ofType(other.CHECK_UPDATE_SUCCESS)
    .do(() => {
      this.toastCtrl.create({
        message: '更新成功',
        duration: 3e3,
        position: 'top'
      }).present()
    })

  @Effect({ dispatch: false })
  checkUpdateFailure$ = this.actions$
    .ofType(other.CHECK_UPDATE_FAILURE)
    .do(() => {
      this.toastCtrl.create({
        message: '更新失败',
        duration: 3e3,
        position: 'top'
      }).present()
    })

  constructor(
    private actions$: Actions,
    private toastCtrl: ToastController,
    private otherService: OtherService,
    private loadCtrl: LoadingController
  ) {}
}
