import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'

import * as fromCompleteMatcher from '../actions/complete-matcher.action'
import * as fromVisitor from '../actions/visitor.action'

import { VisitorMatcherService } from '../services/matcher.service'

import { ToAgreeMatcherModal } from '../modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from '../modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'

import { Store } from '@ngrx/store'
import {
  State,
  getCompleteMatcherDetailID,
  getCurrentCompleteMatcherCount
} from '../reducers'
import { PageStatus } from '../models/visitor.model'
import { VisitorMatcherStatus } from '../models/matcher.model'

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
        content: '获取已完成拉客约请中...',
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
          status: VisitorMatcherStatus.AGREE
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
        statuses: [VisitorMatcherStatus.AGREE],
        direction: direction
      })
    )
    .mergeMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多拉客约请中...',
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
      return new fromVisitor.ChangePageStatusAction(PageStatus.DETAIL)
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private matcherService: VisitorMatcherService,
    private store: Store<State>,
    private loadCtrl: LoadingController
  ) {}
}
