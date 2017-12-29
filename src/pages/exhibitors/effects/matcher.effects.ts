import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'

import * as fromMatcher from '../actions/matcher.action'
import { ExhibitorMatcherService } from '../services/matcher.service'
import { ToCancelMatcherModal } from '../../visitor/modals/to-cancel-matcher-modal/to-cancel-matcher-modal.component'
import { ToAgreeMatcherModal } from '../../visitor/modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from '../../visitor/modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'

import { Store } from '@ngrx/store'
import { State, getCurrentMatcherCount } from '../reducers'

@Injectable()
export class MatcherEffects {
  @Effect()
  fetchMatchers$ = this.actions$
    .ofType(fromMatcher.FETCH_MATCHERS)
    .map((action: fromMatcher.FetchMatchersAction) => action.payload)
    .mergeMap((params) =>
      this.matcherService
        .fetchMatchers(params)
        .map(matchers => new fromMatcher.FetchMatchersSuccessAction(matchers))
        .catch(() =>
          Observable.of(new fromMatcher.FetchMatchersFailureAction())
        )
    )

  @Effect()
  fetchMatchersCount$ = this.actions$
    .ofType(fromMatcher.FETCH_MATCHERS_COUNT)
    .mergeMap(() => {
      return this.matcherService
        .fetchMatcherCount()
        .map(number => {
          return new fromMatcher.FetchMatchersCountSuccessAction(number)
        })
        .catch(() => {
          return Observable.of(
            new fromMatcher.FetchMatchersCountFailureAction()
          )
        })
    })

  @Effect()
  loadMoreMatchers$ = this.actions$
    .ofType(fromMatcher.LOAD_MORE_MATCHERS)
    .map((action: fromMatcher.LoadMoreMatchersAction) => action.statuses)
    .withLatestFrom(
      this.store.select(getCurrentMatcherCount),
      (statuses, currentTotal) => ({
        pageIndex: Math.floor(currentTotal / 10) + 1,
        pageSize: 10,
        statuses
      })
    )
    .mergeMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多约请中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loadingCtrl.dismiss()
          return new fromMatcher.LoadMoreMatchersSuccessAction(matchers)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromMatcher.LoadMoreMatchersFailureAction())
        })
    })

  @Effect()
  toCancelMatcher$ = this.actions$
    .ofType(fromMatcher.TO_CANCEL_MATCHER)
    .map((action: fromMatcher.ToCancelMatcherAction) => action.matcherId)
    .mergeMap(matcherId => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToCancelMatcherModal)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromMatcher.CancelMatcherAction(matcherId)
        } else {
          return new fromMatcher.CancelCancelMatcherAction()
        }
      })
    })

  @Effect()
  cancelMatcher$ = this.actions$
    .ofType(fromMatcher.CANCEL_MATCHER)
    .map((action: fromMatcher.CancelMatcherAction) => action.matcherId)
    .mergeMap(matcherId =>
      this.matcherService
        .cancelMatcher(matcherId)
        .concatMap(() => [
          new fromMatcher.CancelMatcherSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromMatcher.CancelMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  cancelMatcherSuccess$ = this.actions$
    .ofType(fromMatcher.CANCEL_MATCHER_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '取消约请成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  cancelMatcherFailure$ = this.actions$
    .ofType(fromMatcher.CANCEL_MATCHER_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '取消约请失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  toAgreeMatcher$ = this.actions$
    .ofType(fromMatcher.TO_AGREE_MATCHER)
    .map((action: fromMatcher.ToAgreeMatcherAction) => action.matcherId)
    .mergeMap(matcherId => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToAgreeMatcherModal)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromMatcher.AgreeMatcherAction(matcherId)
        } else {
          return new fromMatcher.CancelAgreeMatcherAction()
        }
      })
    })

  @Effect()
  agreeMatcher$ = this.actions$
    .ofType(fromMatcher.AGREE_MATCHER)
    .map((action: fromMatcher.AgreeMatcherAction) => action.matcherId)
    .mergeMap(matcherId => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取约请信息中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.matcherService
        .agreeMatcher(matcherId)
        .concatMap(() => {
          loadingCtrl.dismiss()
          return [
            new fromMatcher.AgreeMatcherSuccessAction(),
            new fromMatcher.FetchMatchersAction()
          ]
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromMatcher.AgreeMatcherFailureAction())
        })
    })

  @Effect({ dispatch: false })
  agreeMatcherSuccess$ = this.actions$
    .ofType(fromMatcher.AGREE_MATCHER_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '同意约请成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  agreeMatcherFailure$ = this.actions$
    .ofType(fromMatcher.AGREE_MATCHER_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '同意约请失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  toRefuseMatcher$ = this.actions$
    .ofType(fromMatcher.TO_REFUSE_MATCHER)
    .map((action: fromMatcher.ToRefuseMatcherAction) => action.matcherId)
    .mergeMap(matcherId => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToRefuseMatcherModal)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromMatcher.RefuseMatcherAction(matcherId)
        } else {
          return new fromMatcher.CancelRefuseMatcherAction()
        }
      })
    })

  @Effect()
  refuseMatcher$ = this.actions$
    .ofType(fromMatcher.REFUSE_MATCHER)
    .map((action: fromMatcher.RefuseMatcherAction) => action.matcherId)
    .mergeMap(matcherId =>
      this.matcherService
        .refuseMatcher(matcherId)
        .concatMap(() => [
          new fromMatcher.RefuseMatcherSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() =>
          Observable.of(new fromMatcher.RefuseMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  refuseMatcherSuccess$ = this.actions$
    .ofType(fromMatcher.REFUSE_MATCHER_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '拒绝约请成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  refuseMatcherFailure$ = this.actions$
    .ofType(fromMatcher.REFUSE_MATCHER_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '拒绝约请失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private matcherService: ExhibitorMatcherService,
    private store: Store<State>
  ) {}
}
