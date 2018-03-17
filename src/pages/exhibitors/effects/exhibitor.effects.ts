import { Injectable, Inject } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { ModalController, LoadingController } from 'ionic-angular'
import * as fromExhibitor from '../actions/exhibitor.action'

import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import {
  ExhibitorLogger,
  ExhibitorLoggerLevel
} from '../models/exhibitor-logger.model'

import { ExhibitorService } from '../services/exhibitor.service'
import { ExhibitorMatcherService } from '../services/matcher.service'
import { ToastService } from '../../../providers/toast.service'

import { ExhibitorLoggerService } from '../services/exhibitor-logger.service'
import { Observable } from 'rxjs/Observable'

import { ToInviteExhibitorModal } from '../modals/to-invite-exhibitor-modal/to-invite-exhibitor-modal.component'
import { ToShowProductModal } from '../modals/to-show-product-modal/to-show-product-modal.component'

import { Store } from '@ngrx/store'
import {
  State,
  getExhibitorShowDetailID,
  getExhibitors,
  getCurrentExhibitorCount
} from '../reducers'
import { getCompanyName, getBoothNo } from '../../login/reducers'
import { ToInviteExhibitorToMicroAppModal } from '../modals/to-invite-exhibitor-to-micro-app-modal/to-invite-exhibitor-to-micro-app-modal.component'
import { PageStatus } from '../models/exhibitor.model'

@Injectable()
export class ExhibitorEffects {
  @Effect()
  fetchExhibitors$ = this.actions$
    .ofType(fromExhibitor.FETCH_EXHIBITORS)
    .map((action: fromExhibitor.FetchExhibitorsAction) => action.params)
    .switchMap(params => {
      const loading = this.loadCtrl.create({
        content: '获取展商中...',
        spinner: 'bubbles'
      })
      loading.present()

      return this.exhibitorService
        .fetchExhibitors(params)
        .map(exhibitors => {
          loading.dismiss()
          return new fromExhibitor.FetchExhibitorsSuccessAction(exhibitors)
        })
        .catch(() => {
          loading.dismiss()
          return Observable.of(new fromExhibitor.FetchExhibitorsFailureAction())
        })
    })

  @Effect()
  fetchExhibitorsCount$ = this.actions$
    .ofType(fromExhibitor.FETCH_EXHIBITORS_COUNT)
    .map((action: fromExhibitor.FetchExhibitorsCountAction) => action.params)
    .switchMap(params => {
      return this.exhibitorService
        .fetchExhibitorsCount(params)
        .map(number => {
          return new fromExhibitor.FetchExhibitorsCountSuccessAction(number)
        })
        .catch(() => {
          return Observable.of(
            new fromExhibitor.FetchExhibitorsCountFailureAction()
          )
        })
    })

  @Effect()
  fetchExhibitorAreaFilters$ = this.actions$
    .ofType(fromExhibitor.FETCH_AREA_FILTER_OPTIONS)
    .switchMap(() => {
      return this.exhibitorService
        .fetchAreaFilters()
        .map(areaFilters => {
          return new fromExhibitor.FetchAreaFilterOptionsSuccessAction(
            areaFilters
          )
        })
        .catch(() => {
          return Observable.of(
            new fromExhibitor.FetchAreaFilterOptionsFailureAction()
          )
        })
    })

  @Effect()
  fetchExhibitorTypeFilters$ = this.actions$
    .ofType(fromExhibitor.FETCH_TYPE_FILTER_OPTIONS)
    .switchMap(() => {
      return this.exhibitorService
        .fetchTypeFilters()
        .map(typeFilters => {
          return new fromExhibitor.FetchTypeFilterOptionsSuccessAction(
            typeFilters
          )
        })
        .catch(() => {
          return Observable.of(
            new fromExhibitor.FetchTypeFilterOptionsFailureAction()
          )
        })
    })

  @Effect()
  loadMoreExhibitors$ = this.actions$
    .ofType(fromExhibitor.LOAD_MORE_EXHIBITORS)
    .map((action: fromExhibitor.LoadMoreExhibitorsAction) => action.params)
    .withLatestFrom(
      this.store.select(getCurrentExhibitorCount),
      (params, currentTotal) => ({
        pageIndex: Math.ceil(currentTotal / this.pageSize) + 1,
        pageSize: this.pageSize,
        ...params
      })
    )
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多展商中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.exhibitorService
        .fetchExhibitors(params)
        .map(exhibitors => {
          loadingCtrl.dismiss()
          return new fromExhibitor.LoadMoreExhibitorsSuccessAction(exhibitors)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(
            new fromExhibitor.LoadMoreExhibitorsFailureAction()
          )
        })
    })

  @Effect({ dispatch: false })
  toInviteExhibitorToMicroApp$ = this.actions$
    .ofType(fromExhibitor.TO_INIVITE_EXHIBITOR_TO_MICRO_APP)
    .do(() => {
      this.modalCtrl
        .create(ToInviteExhibitorToMicroAppModal, null, {
          enableBackdropDismiss: true
        })
        .present()
    })

  @Effect()
  toInviteExhibitor$ = this.actions$
    .ofType(fromExhibitor.TO_INVITE_EXHIBITOR)
    .withLatestFrom(this.store.select(getExhibitorShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getExhibitors), (id, exhibitors) =>
      exhibitors.find(e => e.id === id)
    )
    .withLatestFrom(
      this.store.select(getCompanyName),
      (exhibitor, srcCompanyName) => ({
        destName: exhibitor.name,
        srcName: srcCompanyName,
        destAddress: exhibitor.boothNo
      })
    )
    .withLatestFrom(
      this.store.select(getBoothNo),
      (params, exhibitionAddress) => ({
        ...params,
        srcAddress: exhibitionAddress
      })
    )
    .switchMap(params => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToInviteExhibitorModal, params)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: boolean) => {
        if (ok) {
          return new fromExhibitor.InviteExhibitorAction()
        } else {
          return new fromExhibitor.CancelInviteExhibitorAction()
        }
      })
    })

  @Effect()
  inviteRecommend$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR)
    .withLatestFrom(this.store.select(getExhibitorShowDetailID), (_, id) => id)
    .switchMap(id =>
      this.matcherService
        .createMatcher(id)
        .map(() => new fromExhibitor.InviteExhibitorSuccessAction())
        .catch(() =>
          Observable.of(new fromExhibitor.InviteExhibitorFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteExhibitorSuccess$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR_SUCCESS)
    .do(() => {
      this.toastService.show('约请发送成功')
    })

  @Effect({ dispatch: false })
  inviteExhibitorFailure$ = this.actions$
    .ofType(fromExhibitor.INVITE_EXHIBITOR_FAILURE)
    .do(() => {
      this.toastService.show('约请发送失败')
    })

  @Effect()
  toCreateLogger$ = this.actions$
    .ofType(fromExhibitor.TO_CREATE_LOGGER)
    .switchMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const loggerModal = this.modalCtrl.create(ToCreateLoggerModal, {})

          loggerModal.onDidDismiss((log: ExhibitorLogger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: ExhibitorLogger) => {
        if (log) {
          return new fromExhibitor.CreateLoggerAction(log)
        } else {
          return new fromExhibitor.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromExhibitor.CREATE_LOGGER)
    .map((action: fromExhibitor.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getExhibitorShowDetailID))
    .switchMap(([log, exhibitorId]) =>
      this.exhibitorLoggerService
        .createLog({
          ...log,
          exhibitorId
        })
        .concatMap(() => {
          return [
            new fromExhibitor.CreateLoggerSuccessAction(log.level),
            new fromExhibitor.FetchLoggerAction(exhibitorId)
          ]
        })
        .catch(() =>
          Observable.of(new fromExhibitor.CreateLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromExhibitor.CREATE_LOGGER_SUCCESS)
    .map((action: fromExhibitor.CreateLoggerSuccessAction) => action.level)
    .do(level => {
      // 非系统日志 弹出toast
      if (level !== ExhibitorLoggerLevel.SYS) {
        this.toastService.show('添加日志成功')
      }
    })

  @Effect({ dispatch: false })
  createLoggerFailure$ = this.actions$
    .ofType(fromExhibitor.CREATE_LOGGER_FAILURE)
    .do(() => {
      this.toastService.show('添加日志失败')
    })

  @Effect()
  fetchLogger$ = this.actions$
    .ofType(fromExhibitor.FETCH_LOGGER)
    .map((action: fromExhibitor.FetchLoggerAction) => action.exhibitorID)
    .switchMap(exhibitionID =>
      this.exhibitorLoggerService
        .fetchLogger(exhibitionID)
        .map(logs => new fromExhibitor.FetchLoggerSuccessAction(logs))
        .catch(() =>
          Observable.of(new fromExhibitor.FetchLoggerFailureAction())
        )
    )

  @Effect({ dispatch: false })
  toShowProduct$ = this.actions$
    .ofType(fromExhibitor.TO_SHOW_PRODUCT)
    .map((action: fromExhibitor.ToShowProcuctAction) => action.product)
    .do(product => {
      this.modalCtrl.create(ToShowProductModal, product).present()
    })

  @Effect()
  updateExhibitorDetailID$ = this.actions$
    .ofType(fromExhibitor.UPDATE_EXHIBITOR_DETAIL_ID)
    .map(() => {
      return new fromExhibitor.ChangePageStatusAction(PageStatus.DETAIL)
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loadCtrl: LoadingController,
    private exhibitorService: ExhibitorService,
    private matcherService: ExhibitorMatcherService,
    private exhibitorLoggerService: ExhibitorLoggerService,
    private store: Store<State>,
    @Inject('DEFAULT_PAGE_SIZE') private pageSize
  ) {}
}
