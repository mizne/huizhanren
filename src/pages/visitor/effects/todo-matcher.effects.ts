import { Injectable, Inject } from '@angular/core'
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
        pageIndex: Math.ceil(currentTotal / this.pageSize) + 1,
        pageSize: this.pageSize,
        statuses: [params.status],
        direction: params.direction
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
    .ofType(fromToDoMatcher.TO_AGREE_TODO_MATCHER)
    .map((action: fromToDoMatcher.ToAgreeToDoMatcherAction) => action.matcherId)
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
          return new fromToDoMatcher.AgreeToDoMatcherAction(matcherId)
        } else {
          return new fromToDoMatcher.CancelAgreeToDoMatcherAction()
        }
      })
    })

  @Effect()
  agreeMatcher$ = this.actions$
    .ofType(fromToDoMatcher.AGREE_TODO_MATCHER)
    .map((action: fromToDoMatcher.AgreeToDoMatcherAction) => action.matcherId)
    .switchMap(matcherId =>
      this.matcherService
        .agreeMatcher(matcherId)
        .map(() => new fromToDoMatcher.AgreeToDoMatcherSuccessAction(matcherId))
        .catch(() =>
          Observable.of(new fromToDoMatcher.AgreeToDoMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  agreeMatcherSuccess$ = this.actions$
    .ofType(fromToDoMatcher.AGREE_TODO_MATCHER_SUCCESS)
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
    .ofType(fromToDoMatcher.AGREE_TODO_MATCHER_FAILURE)
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
    .ofType(fromToDoMatcher.TO_BATCH_AGREE_TODO_MATCHERS)
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
            return new fromToDoMatcher.BatchAgreeToDoMatchersAction()
          } else {
            return new fromToDoMatcher.CancelBatchAgreeToDoMatchersAction()
          }
        })
        .catch(e => {
          return Observable.of(
            new fromToDoMatcher.CancelBatchAgreeToDoMatchersAction(e.message)
          )
        })
    })

  @Effect()
  batchAgreeMatchers$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_TODO_MATCHERS)
    .withLatestFrom(this.store.select(getToDoMatchers))
    .switchMap(([_, matchers]) => {
      const toAgreeMatchers = matchers.filter(
        e => e.isReceiver && e.status === VisitorMatcherStatus.AUDIT_SUCCEED
      )

      return this.matcherService
        .batchAgreeMatcher(toAgreeMatchers.map(e => e.id))
        .map(() => new fromToDoMatcher.BatchAgreeToDoMatchersSuccessAction())
        .catch(() =>
          Observable.of(
            new fromToDoMatcher.BatchAgreeToDoMatchersFailureAction()
          )
        )
    })

  @Effect({ dispatch: false })
  batchAgreeMatchersSuccess$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_TODO_MATCHERS_SUCCESS)
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
    .ofType(fromToDoMatcher.BATCH_AGREE_TODO_MATCHERS_FAILURE)
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
    .ofType(fromToDoMatcher.CANCEL_BATCH_AGREE_TODO_MATCHERS)
    .map(
      (action: fromToDoMatcher.CancelBatchAgreeToDoMatchersAction) =>
        action.message
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
    .ofType(fromToDoMatcher.TO_REFUSE_TODO_MATCHER)
    .map(
      (action: fromToDoMatcher.ToRefuseToDoMatcherAction) => action.matcherId
    )
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
          return new fromToDoMatcher.RefuseToDoMatcherAction(matcherId)
        } else {
          return new fromToDoMatcher.CancelRefuseToDoMatcherAction()
        }
      })
    })

  @Effect()
  refuseMatcher$ = this.actions$
    .ofType(fromToDoMatcher.REFUSE_TODO_MATCHER)
    .map((action: fromToDoMatcher.RefuseToDoMatcherAction) => action.matcherId)
    .switchMap(matcherId =>
      this.matcherService
        .refuseMatcher(matcherId)
        .map(
          () => new fromToDoMatcher.RefuseToDoMatcherSuccessAction(matcherId)
        )
        .catch(() =>
          Observable.of(new fromToDoMatcher.RefuseToDoMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  refuseMatcherSuccess$ = this.actions$
    .ofType(fromToDoMatcher.REFUSE_TODO_MATCHER_SUCCESS)
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
    .ofType(fromToDoMatcher.REFUSE_TODO_MATCHER_FAILURE)
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
    private loadCtrl: LoadingController,
    @Inject('DEFAULT_PAGE_SIZE') private pageSize
  ) {}
}
