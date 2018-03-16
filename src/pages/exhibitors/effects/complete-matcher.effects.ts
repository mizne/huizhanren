import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'

import * as fromCompleteMatcher from '../actions/complete-matcher.action'
import * as fromExhibitor from '../actions/exhibitor.action'

import { ExhibitorMatcherService } from '../services/matcher.service'

import { ToAgreeMatcherModal } from '../../visitor/modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from '../../visitor/modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'

import { Store } from '@ngrx/store'
import {
  State,
  getCompleteMatcherShowDetailID,
  getCurrentCompleteMatcherCount
} from '../reducers'
import { PageStatus } from '../models/exhibitor.model'
import { ExhibitorMatcherStatus } from '../models/matcher.model'

@Injectable()
export class CompleteMatcherEffects {
  @Effect()
  fetchCompleteMatchers$ = this.actions$
    .ofType(fromCompleteMatcher.FETCH_COMPLETE_MATCHERS)
    .map(
      (action: fromCompleteMatcher.FetchCompleteMatchersAction) =>
        action.payload
    )
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取已完成展商约请中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()

      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loadingCtrl.dismiss()
          return new fromCompleteMatcher.FetchCompleteMatchersSuccessAction(
            matchers
          )
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromCompleteMatcher.FetchCompleteMatchersFailureAction()
          )
        })
    })

  @Effect()
  fetchCompleteMatchersCount$ = this.actions$
    .ofType(fromCompleteMatcher.FETCH_COMPLETE_MATCHERS_COUNT)
    .map(
      (action: fromCompleteMatcher.FetchCompleteMatchersCountAction) =>
        action.params
    )
    .switchMap(direction => {
      return this.matcherService
        .fetchMatcherCount({
          direction,
          status: ExhibitorMatcherStatus.AGREE
        })
        .map(number => {
          return new fromCompleteMatcher.FetchCompleteMatchersCountSuccessAction(
            number
          )
        })
        .catch(() => {
          return Observable.of(
            new fromCompleteMatcher.FetchCompleteMatchersCountFailureAction()
          )
        })
    })

  @Effect()
  loadMoreCompleteMatchers$ = this.actions$
    .ofType(fromCompleteMatcher.LOAD_MORE_COMPLETE_MATCHERS)
    .map(
      (action: fromCompleteMatcher.LoadMoreCompleteMatchersAction) =>
        action.params
    )
    .withLatestFrom(
      this.store.select(getCurrentCompleteMatcherCount),
      (direction, currentTotal) => ({
        pageIndex: Math.ceil(currentTotal / 10) + 1,
        pageSize: 10,
        statuses: [ExhibitorMatcherStatus.AGREE],
        direction: direction
      })
    )
    .mergeMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多展商约请中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loadingCtrl.dismiss()
          return new fromCompleteMatcher.LoadMoreCompleteMatchersSuccessAction(
            matchers
          )
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromCompleteMatcher.LoadMoreCompleteMatchersFailureAction()
          )
        })
    })

  @Effect()
  updateMatcherDetailID$ = this.actions$
    .ofType(fromCompleteMatcher.UPDATE_COMPLETE_MATCHER_DETAIL_ID)
    .map(() => {
      return new fromExhibitor.ChangePageStatusAction(PageStatus.DETAIL)
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private matcherService: ExhibitorMatcherService,
    private store: Store<State>,
    private loadCtrl: LoadingController
  ) {}
}
