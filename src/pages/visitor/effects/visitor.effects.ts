import { Injectable, Inject } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { ModalController, LoadingController } from 'ionic-angular'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'

import * as fromVisitor from '../actions/visitor.action'
import { ToCreateLoggerModal } from '../../customer/modals/to-create-logger-modal.component'
import { ToastService } from '../../../providers/toast.service'
import {
  VisitorLogger,
  VisitorLoggerLevel
} from '../models/visitor-logger.model'
import { VisitorService } from '../services/visitor.service'
import { VisitorMatcherService } from '../services/matcher.service'
import { VisitorLoggerService } from '../services/visitor-logger.service'
import { ToInviteCustomerModal } from '../modals/to-invite-customer-modal/to-invite-customer-modal.component'
import {
  State,
  getVisitorShowDetailID,
  getVisitors,
  getCurrentVisitorCount
} from '../reducers'
import { getCompanyName, getBoothNo, getTenantId } from '../../login/reducers'
import { PageStatus } from '../models/visitor.model'
import { ToInviteVisitorModal } from '../modals/to-invite-visitor-modal/to-invite-visitor-modal.component'

@Injectable()
export class VisitorEffects {
  @Effect()
  fetchVisitors$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS)
    .map((action: fromVisitor.FetchVisitorsAction) => action.params)
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取客户中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.visitorService
        .fetchVisitors(params)
        .map(recommends => {
          loadingCtrl.dismiss()
          return new fromVisitor.FetchVisitorsSuccessAction(recommends)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromVisitor.FetchVisitorsFailureAction())
        })
    })

  @Effect({ dispatch: false })
  fetchVisitorsFailure$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS_FAILURE)
    .do(() => {
      this.toastService.show('获取客户失败')
    })

  @Effect()
  fetchVisitorsCount$ = this.actions$
    .ofType(fromVisitor.FETCH_VISITORS_COUNT)
    .map((action: fromVisitor.FetchVisitorsCountAction) => action.params)
    .switchMap(params => {
      return this.visitorService
        .fetchVisitorCount(params)
        .map(number => {
          return new fromVisitor.FetchVisitorsCountSuccessAction(number)
        })
        .catch(() => {
          return Observable.of(
            new fromVisitor.FetchVisitorsCountFailureAction()
          )
        })
    })

  @Effect()
  fetchAreaFilters$ = this.actions$
    .ofType(fromVisitor.FETCH_AREA_FILTER_OPTIONS)
    .switchMap(() => {
      return this.visitorService
        .fetchAreaFilters()
        .map(areaFilters => {
          return new fromVisitor.FetchAreaFilterOptionsSuccessAction(
            areaFilters
          )
        })
        .catch(() => {
          return Observable.of(
            new fromVisitor.FetchAreaFilterOptionsFailureAction()
          )
        })
    })

  @Effect()
  fetchTypeFilters$ = this.actions$
    .ofType(fromVisitor.FETCH_TYPE_FILTER_OPTIONS)
    .switchMap(() => {
      return this.visitorService
        .fetchTypeFilters()
        .map(typeFilters => {
          return new fromVisitor.FetchTypeFilterOptionsSuccessAction(
            typeFilters
          )
        })
        .catch(() => {
          return Observable.of(
            new fromVisitor.FetchTypeFilterOptionsFailureAction()
          )
        })
    })

  @Effect()
  loadMoreVisitors$ = this.actions$
    .ofType(fromVisitor.LOAD_MORE_VISITORS)
    .map((action: fromVisitor.LoadMoreVisitorsAction) => action.params)
    .withLatestFrom(
      this.store.select(getCurrentVisitorCount),
      (params, currentTotal) => ({
        pageIndex: Math.ceil(currentTotal / this.pageSize) + 1,
        pageSize: this.pageSize,
        ...params
      })
    )
    .switchMap(params => {
      const loadingCtrl = this.loadCtrl.create({
        content: '获取更多客户中...',
        spinner: 'bubbles'
      })
      loadingCtrl.present()
      return this.visitorService
        .fetchVisitors(params)
        .map(visitors => {
          loadingCtrl.dismiss()
          return new fromVisitor.LoadMoreVisitorsSuccessAction(visitors)
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromVisitor.LoadMoreVisitorsFailureAction())
        })
    })

  @Effect({ dispatch: false })
  loadMoreVisitorsFailure$ = this.actions$
    .ofType(fromVisitor.LOAD_MORE_VISITORS_FAILURE)
    .do(() => {
      this.toastService.show('获取更多客户失败')
    })

  @Effect()
  updateVisitorDetailID$ = this.actions$
    .ofType(fromVisitor.UPDATE_VISITOR_DETAIL_ID)
    .map(() => {
      return new fromVisitor.ChangePageStatusAction(PageStatus.DETAIL)
    })

  @Effect({ dispatch: false })
  toInviteVisitorToMicroApp$ = this.actions$
    .ofType(fromVisitor.TO_INIVITE_VISITOR_TO_MICRO_APP)
    .do(() => {
      this.modalCtrl
        .create(ToInviteVisitorModal, null, {
          enableBackdropDismiss: true
        })
        .present()
    })

  @Effect()
  toInviteVisitor$ = this.actions$
    .ofType(fromVisitor.TO_INVITE_VISITOR)
    .withLatestFrom(this.store.select(getVisitorShowDetailID), (_, id) => id)
    .withLatestFrom(this.store.select(getVisitors), (id, recommends) =>
      recommends.find(e => e.id === id)
    )
    .withLatestFrom(
      this.store.select(getCompanyName),
      (recommend, srcCompanyName) => ({
        destName: recommend.name,
        destTitle: recommend.title,
        destCompany: recommend.company,
        srcCompany: srcCompanyName
      })
    )
    .withLatestFrom(this.store.select(getBoothNo), (params, boothNo) => {
      return {
        ...params,
        boothNo
      }
    })
    .switchMap(params => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const modal = this.modalCtrl.create(ToInviteCustomerModal, params)
          modal.onDidDismiss(ok => {
            res(ok)
          })
          modal.present()
        })
      ).map((ok: string) => {
        if (ok) {
          return new fromVisitor.InviteVisitorAction()
        } else {
          return new fromVisitor.CancelInviteVisitorAction()
        }
      })
    })

  @Effect()
  inviteVisitor$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR)
    .withLatestFrom(this.store.select(getVisitorShowDetailID), (_, id) => id)
    .switchMap(visitorId =>
      this.matcherService
        .createMatcher(visitorId)
        .map(() => new fromVisitor.InviteVisitorSuccessAction())
        .catch(() =>
          Observable.of(new fromVisitor.InviteVisitorFailureAction())
        )
    )

  @Effect({ dispatch: false })
  inviteVisitorSuccess$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR_SUCCESS)
    .do(() => {
      this.toastService.show('约请发送成功')
    })

  @Effect({ dispatch: false })
  inviteVisitorFailure$ = this.actions$
    .ofType(fromVisitor.INVITE_VISITOR_FAILURE)
    .do(() => {
      this.toastService.show('约请发送失败')
    })

  @Effect()
  toCreateLogger$ = this.actions$
    .ofType(fromVisitor.TO_CREATE_LOGGER)
    .switchMap(() => {
      return Observable.fromPromise(
        new Promise((res, _) => {
          const loggerModal = this.modalCtrl.create(ToCreateLoggerModal, {})

          loggerModal.onDidDismiss((log: VisitorLogger) => {
            res(log)
          })

          loggerModal.present()
        })
      ).map((log: VisitorLogger) => {
        if (log) {
          return new fromVisitor.CreateLoggerAction(log)
        } else {
          return new fromVisitor.CancelCreateLoggerAction()
        }
      })
    })

  @Effect()
  createLogger$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER)
    .map((action: fromVisitor.CreateLoggerAction) => action.log)
    .withLatestFrom(this.store.select(getVisitorShowDetailID))
    .switchMap(([log, visitorId]) =>
      this.visitorLoggerService
        .createLog({
          ...log,
          visitorId
        })
        .concatMap(() => {
          return [
            new fromVisitor.CreateLoggerSuccessAction(log.level),
            new fromVisitor.FetchLoggerAction(visitorId)
          ]
        })
        .catch(() => Observable.of(new fromVisitor.CreateLoggerFailureAction()))
    )

  @Effect({ dispatch: false })
  createLoggerSuccess$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER_SUCCESS)
    .map((action: fromVisitor.CreateLoggerSuccessAction) => action.level)
    .do(level => {
      // 非系统日志 弹出toast
      if (level !== VisitorLoggerLevel.SYS) {
        this.toastService.show('添加日志成功')
      }
    })

  @Effect({ dispatch: false })
  createLoggerFailure$ = this.actions$
    .ofType(fromVisitor.CREATE_LOGGER_FAILURE)
    .do(() => {
      this.toastService.show('添加日志失败')
    })

  @Effect()
  fetchLogger$ = this.actions$
    .ofType(fromVisitor.FETCH_LOGGER)
    .map((action: fromVisitor.FetchLoggerAction) => action.visitorID)
    .switchMap(visitorID =>
      this.visitorLoggerService
        .fetchLogger(visitorID)
        .map(logs => new fromVisitor.FetchLoggerSuccessAction(logs))
        .catch(() => Observable.of(new fromVisitor.FetchLoggerFailureAction()))
    )

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private loadCtrl: LoadingController,
    private visitorService: VisitorService,
    private matcherService: VisitorMatcherService,
    private visitorLoggerService: VisitorLoggerService,
    private store: Store<State>,
    @Inject('DEFAULT_PAGE_SIZE') private pageSize
  ) {}
}
