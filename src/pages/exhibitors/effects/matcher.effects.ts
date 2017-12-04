import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable';

import { ModalController, ToastController } from 'ionic-angular'

import * as fromMatcher from '../actions/matcher.action'

import { MatcherService } from '../services/matcher.service'

@Injectable()
export class MatcherEffects {
  @Effect()
  fetchMatchers$ = this.actions$
    .ofType(fromMatcher.FETCH_MATCHERS)
    .map((action: fromMatcher.FetchMatchersAction) => action.payload)
    .mergeMap(({ pageIndex, pageSize }) =>
      this.matcherService
        .fetchMatchers(pageIndex, pageSize)
        .map(matchers => new fromMatcher.FetchMatchersSuccessAction(matchers))
        .catch(err => Observable.of(new fromMatcher.FetchMatchersFailureAction()))
    )

  @Effect()
  agreeMatcher$ = this.actions$
    .ofType(fromMatcher.AGREE_MATCHER)
    .map((action: fromMatcher.AgreeMatcherAction) => action.matcherId)
    .mergeMap(matcherId =>
      this.matcherService
        .agreeMatcher(matcherId)
        .concatMap(() => [
          new fromMatcher.AgreeMatcherSuccessAction(),
          new fromMatcher.FetchMatchersAction()
        ])
        .catch(() => Observable.of(new fromMatcher.AgreeMatcherFailureAction()))
    )

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
        .catch(() => Observable.of(new fromMatcher.RefuseMatcherFailureAction()))
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
    private matcherService: MatcherService
  ) {}
}