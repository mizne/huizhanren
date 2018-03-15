import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'

import * as fromToDoMatcher from '../actions/todo-matcher.action'
import * as fromVisitor from '../actions/visitor.action'

import { VisitorMatcherService } from '../services/matcher.service'

import { ToCancelMatcherModal } from '../modals/to-cancel-matcher-modal/to-cancel-matcher-modal.component'
import { ToAgreeMatcherModal } from '../modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from '../modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'

import { Store } from '@ngrx/store'
import { State, getCurrentToDoMatcherCount, getToDoMatchers } from '../reducers'
import { PageStatus } from '../models/visitor.model'
import { VisitorMatcherStatus } from '../models/matcher.model'
import { ToBatchAgreeMatchersModal } from '../modals/to-batch-agree-matcher-modal/to-batch-agree-matcher-modal.component'

@Injectable()
export class ToDoMatcherEffects {
  @Effect()
  fetchToDoMatchers$ = this.actions$
    .ofType(fromToDoMatcher.FETCH_TODO_MATCHERS)
    .map((action: fromToDoMatcher.FetchToDoMatchersAction) => action.payload)
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取待处理拉客约请中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()

      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loadingCtrl.dismiss()
          return new fromToDoMatcher.FetchToDoMatchersSuccessAction(matchers)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromToDoMatcher.FetchToDoMatchersFailureAction()
          )
        })
    })

  @Effect()
  fetchToDoMatchersCount$ = this.actions$
    .ofType(fromToDoMatcher.FETCH_TODO_MATCHERS_COUNT)
    .map(
      (action: fromToDoMatcher.FetchToDoMatchersCountAction) => action.params
    )
    .switchMap(params => {
      return this.matcherService
        .fetchMatcherCount(params)
        .map(number => {
          return new fromToDoMatcher.FetchToDoMatchersCountSuccessAction(number)
        })
        .catch(() => {
          return Observable.of(
            new fromToDoMatcher.FetchToDoMatchersCountFailureAction()
          )
        })
    })

  @Effect()
  loadMoreToDoMatchers$ = this.actions$
    .ofType(fromToDoMatcher.LOAD_MORE_TODO_MATCHERS)
    .map((action: fromToDoMatcher.LoadMoreToDoMatchersAction) => action.params)
    .withLatestFrom(
      this.store.select(getCurrentToDoMatcherCount),
      (params, currentTotal) => ({
        pageIndex: Math.ceil(currentTotal / 10) + 1,
        pageSize: 10,
        statuses: [params.status],
        direction: params.direction
      })
    )
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多拉客约请中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loadingCtrl.dismiss()
          return new fromToDoMatcher.LoadMoreToDoMatchersSuccessAction(matchers)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromToDoMatcher.LoadMoreToDoMatchersFailureAction()
          )
        })
    })

  @Effect()
  toAgreeMatcher$ = this.actions$
    .ofType(fromToDoMatcher.TO_AGREE_MATCHER)
    .map((action: fromToDoMatcher.ToAgreeMatcherAction) => action.matcherId)
    .switchMap(matcherId => {
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
          return new fromToDoMatcher.AgreeMatcherAction(matcherId)
        } else {
          return new fromToDoMatcher.CancelAgreeMatcherAction()
        }
      })
    })

  @Effect()
  agreeMatcher$ = this.actions$
    .ofType(fromToDoMatcher.AGREE_MATCHER)
    .map((action: fromToDoMatcher.AgreeMatcherAction) => action.matcherId)
    .switchMap(matcherId =>
      this.matcherService
        .agreeMatcher(matcherId)
        .map(() => new fromToDoMatcher.AgreeMatcherSuccessAction(matcherId))
        .catch(() =>
          Observable.of(new fromToDoMatcher.AgreeMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  agreeMatcherSuccess$ = this.actions$
    .ofType(fromToDoMatcher.AGREE_MATCHER_SUCCESS)
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
    .ofType(fromToDoMatcher.AGREE_MATCHER_FAILURE)
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
  toBatchAgreeMatcher$ = this.actions$
    .ofType(fromToDoMatcher.TO_BATCH_AGREE_MATCHERS)
    .withLatestFrom(this.store.select(getToDoMatchers))
    .switchMap(([_, matchers]) => {
      const toAgreeMatchers = matchers.filter(
        e => e.isReceiver && e.status === VisitorMatcherStatus.AUDIT_SUCCEED
      )
      return Observable.fromPromise(
        new Promise((res, rej) => {
          if (toAgreeMatchers.length > 0) {
            const modal = this.modalCtrl.create(ToBatchAgreeMatchersModal, {
              count: toAgreeMatchers.length
            })
            modal.onDidDismiss(ok => {
              res(ok)
            })
            modal.present()
          } else {
            rej(new Error('还没有约请可以接受'))
          }
        })
      )
        .map((ok: string) => {
          if (ok) {
            return new fromToDoMatcher.BatchAgreeMatchersAction()
          } else {
            return new fromToDoMatcher.CancelBatchAgreeMatchersAction()
          }
        })
        .catch(e => {
          return Observable.of(
            new fromToDoMatcher.CancelBatchAgreeMatchersAction(e.message)
          )
        })
    })

  @Effect()
  batchAgreeMatchers$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_MATCHERS)
    .withLatestFrom(this.store.select(getToDoMatchers))
    .switchMap(([_, matchers]) => {
      const toAgreeMatchers = matchers.filter(
        e => e.isReceiver && e.status === VisitorMatcherStatus.AUDIT_SUCCEED
      )

      return this.matcherService
        .batchAgreeMatcher(toAgreeMatchers.map(e => e.id))
        .map(() => new fromToDoMatcher.BatchAgreeMatchersSuccessAction())
        .catch(() =>
          Observable.of(new fromToDoMatcher.BatchAgreeMatchersFailureAction())
        )
    })

  @Effect({ dispatch: false })
  batchAgreeMatchersSuccess$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_MATCHERS_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '批量同意约请成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  batchAgreeMatchersFailure$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_MATCHERS_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '批量同意约请失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  cancelBatchAgreeMatchers$ = this.actions$
    .ofType(fromToDoMatcher.CANCEL_BATCH_AGREE_MATCHERS)
    .map(
      (action: fromToDoMatcher.CancelBatchAgreeMatchersAction) => action.message
    )
    .do(message => {
      if (message) {
        this.toastCtrl
          .create({
            message,
            duration: 3e3,
            position: 'top'
          })
          .present()
      }
    })

  @Effect()
  toRefuseMatcher$ = this.actions$
    .ofType(fromToDoMatcher.TO_REFUSE_MATCHER)
    .map((action: fromToDoMatcher.ToRefuseMatcherAction) => action.matcherId)
    .switchMap(matcherId => {
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
          return new fromToDoMatcher.RefuseMatcherAction(matcherId)
        } else {
          return new fromToDoMatcher.CancelRefuseMatcherAction()
        }
      })
    })

  @Effect()
  refuseMatcher$ = this.actions$
    .ofType(fromToDoMatcher.REFUSE_MATCHER)
    .map((action: fromToDoMatcher.RefuseMatcherAction) => action.matcherId)
    .switchMap(matcherId =>
      this.matcherService
        .refuseMatcher(matcherId)
        .map(() => new fromToDoMatcher.RefuseMatcherSuccessAction(matcherId))
        .catch(() =>
          Observable.of(new fromToDoMatcher.RefuseMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  refuseMatcherSuccess$ = this.actions$
    .ofType(fromToDoMatcher.REFUSE_MATCHER_SUCCESS)
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
    .ofType(fromToDoMatcher.REFUSE_MATCHER_FAILURE)
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
    private matcherService: VisitorMatcherService,
    private store: Store<State>,
    private loadCtrl: LoadingController
  ) {}
}
