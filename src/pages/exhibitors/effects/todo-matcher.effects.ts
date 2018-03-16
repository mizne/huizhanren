import { Injectable, Inject } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'
import { Store } from '@ngrx/store'

import * as fromToDoMatcher from '../actions/todo-matcher.action'
import * as fromExhibitor from '../actions/exhibitor.action'
import { ExhibitorMatcherService } from '../services/matcher.service'
import { ToCancelMatcherModal } from '../../visitor/modals/to-cancel-matcher-modal/to-cancel-matcher-modal.component'
import { ToAgreeMatcherModal } from '../../visitor/modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from '../../visitor/modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'
import { State, getCurrentToDoMatcherCount, getToDoMatchers } from '../reducers'
import { ExhibitorMatcherStatus } from '../models/matcher.model'
import { PageStatus } from '../models/exhibitor.model'
import { ToBatchAgreeMatchersModal } from '../modals/to-batch-agree-matcher-modal/to-batch-agree-matcher-modal.component'

@Injectable()
export class ToDoMatcherEffects {
  @Effect()
  fetchToDoMatchers$ = this.actions$
    .ofType(fromToDoMatcher.FETCH_TODO_MATCHERS)
    .map((action: fromToDoMatcher.FetchToDoMatchersAction) => action.payload)
    .switchMap(params => {
      const loading = this.loadCtrl.create({
        content: '获取待处理展商约请中...',
        spinner: 'bubbles'
      })
      loading.present()

      return this.matcherService
        .fetchMatchers(params)
        .map(matchers => {
          loading.dismiss()
          return new fromToDoMatcher.FetchToDoMatchersSuccessAction(matchers)
        })
        .catch(() => {
          loading.dismiss()
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
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多展商约请中...',
        spinner: 'bubbles',
        dismissOnPageChange: true
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
  toAgreeToDoMatcher$ = this.actions$
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
  agreeToDoMatcher$ = this.actions$
    .ofType(fromToDoMatcher.AGREE_TODO_MATCHER)
    .map((action: fromToDoMatcher.AgreeToDoMatcherAction) => action.matcherId)
    .switchMap(matcherId => {
      return this.matcherService
        .agreeMatcher(matcherId)
        .concatMap(() => {
          return [
            new fromToDoMatcher.AgreeToDoMatcherSuccessAction(matcherId),
            new fromExhibitor.ChangePageStatusAction(PageStatus.LIST)
          ]
        })
        .catch(() => {
          return Observable.of(
            new fromToDoMatcher.AgreeToDoMatcherFailureAction()
          )
        })
    })

  @Effect({ dispatch: false })
  agreeToDoMatcherSuccess$ = this.actions$
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
  agreeToDoMatcherFailure$ = this.actions$
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
  toBatchAgreeToDoMatcher$ = this.actions$
    .ofType(fromToDoMatcher.TO_BATCH_AGREE_TODO_MATCHERS)
    .withLatestFrom(this.store.select(getToDoMatchers))
    .switchMap(([_, matchers]) => {
      const toAgreeMatchers = matchers.filter(
        e => e.isReceiver && e.status === ExhibitorMatcherStatus.AUDIT_SUCCEED
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
  batchAgreeToDoMatchers$ = this.actions$
    .ofType(fromToDoMatcher.BATCH_AGREE_TODO_MATCHERS)
    .withLatestFrom(this.store.select(getToDoMatchers))
    .switchMap(([_, matchers]) => {
      const toAgreeMatchers = matchers.filter(
        e => e.isReceiver && e.status === ExhibitorMatcherStatus.AUDIT_SUCCEED
      )

      return this.matcherService
        .batchAgreeMatcher(toAgreeMatchers.map(e => e.id))
        .concatMap(() => [
          new fromToDoMatcher.BatchAgreeToDoMatchersSuccessAction(),
          new fromExhibitor.ChangePageStatusAction(PageStatus.LIST)
        ])
        .catch(() =>
          Observable.of(
            new fromToDoMatcher.BatchAgreeToDoMatchersFailureAction()
          )
        )
    })

  @Effect({ dispatch: false })
  batchAgreeToDoMatchersSuccess$ = this.actions$
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
  batchAgreeToDoMatchersFailure$ = this.actions$
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
  cancelBatchAgreeToDoMatchers$ = this.actions$
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
  toRefuseToDoMatcher$ = this.actions$
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
  refuseToDoMatcher$ = this.actions$
    .ofType(fromToDoMatcher.REFUSE_TODO_MATCHER)
    .map((action: fromToDoMatcher.RefuseToDoMatcherAction) => action.matcherId)
    .switchMap(matcherId =>
      this.matcherService
        .refuseMatcher(matcherId)
        .concatMap(() => [
          new fromToDoMatcher.RefuseToDoMatcherSuccessAction(matcherId),
          new fromExhibitor.ChangePageStatusAction(PageStatus.LIST)
        ])
        .catch(() =>
          Observable.of(new fromToDoMatcher.RefuseToDoMatcherFailureAction())
        )
    )

  @Effect({ dispatch: false })
  refuseToDoMatcherSuccess$ = this.actions$
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
  refuseToDoMatcherFailure$ = this.actions$
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

  @Effect()
  updateMatcherDetailID$ = this.actions$
    .ofType(fromToDoMatcher.UPDATE_TODO_MATCHER_DETAIL_ID)
    .map(() => {
      return new fromExhibitor.ChangePageStatusAction(PageStatus.DETAIL)
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private matcherService: ExhibitorMatcherService,
    private store: Store<State>,
    @Inject('DEFAULT_PAGE_SIZE') private pageSize
  ) {}
}
