import { Component, OnInit, OnDestroy } from '@angular/core'
import {
  NavController,
  ToastController,
  ModalController,
  LoadingController,
  App,
  IonicPage
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Store } from '@ngrx/store'
import {
  State,
  getListStatus,
  getPageStatus,
  getShowDetailID,
  getRecommends,
  getMatchers,
  getLogs
} from './reducers/index'
import {
  ToCreateLoggerAction,
  ChangePageStatusAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchRecommendAction,
  UpdateDetailIDAction,
  ToInviteRecommendAction,
  FetchLoggerAction
} from './actions/recommend.action'
import { FetchMatchersAction } from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Recommend,
  Portray,
  FetchRecommendParams,
  RecommendFilter,
  AREA_OPTIONS
} from './models/recommend.model'
import { DestroyService } from '../../providers/destroy.service'

import { Logger, LoggerLevel } from '../customer/models/logger.model'
import { Customer } from './models/recommend.model'
import { Matcher, MatcherStatus } from './models/matcher.model'
import { ToInviteCustomerModal } from './modals/to-invite-customer-modal/to-invite-customer-modal.component'

@IonicPage()
@Component({
  selector: 'page-recommend',
  templateUrl: 'recommend.html',
  providers: [DestroyService]
})
export class RecommendPage implements OnInit, OnDestroy {
  recommends$: Observable<Recommend[]>
  matchers$: Observable<Matcher[]>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<Customer>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  recommendFilterSub: Subject<RecommendFilter> = new Subject<RecommendFilter>()
  matcherFilterSub: Subject<MatcherStatus[]> = new Subject<MatcherStatus[]>()
  loadMoreSub: Subject<void> = new Subject<void>()

  filterOptions = [
    AREA_OPTIONS,
    [
      {
        label: '不限分类',
        value: ''
      },
      {
        label: '自行车整车',
        value: 'zixingchezhengche'
      },
      {
        label: '零配件',
        value: 'lingpeijian'
      }
    ],
    [
      {
        label: '默认排序',
        value: '0'
      }
    ]
  ]

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private app: App,
    private store: Store<State>,
    private destroyService: DestroyService
  ) {}

  ngOnInit() {
    this.initDataSource()
    this.initSubscriber()
    this.initDispatch()
  }

  ngOnDestroy() {}

  loadMore() {
    this.loadMoreSub.next()
  }

  updateDetailID(id: string) {
    this.store.dispatch(new UpdateDetailIDAction(id))
  }

  toggleLog() {
    this.store.dispatch(new TogglePageStatusAction())
  }

  ensureInvite() {
    console.log('ensure invite')
    this.store.dispatch(new ToInviteRecommendAction())
  }

  ensureCreateLog() {
    console.log('ensure create log')
    this.store.dispatch(new ToCreateLoggerAction())
  }

  private initDataSource() {
    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.recommends$ = this.store.select(getRecommends)
    this.matchers$ = Observable.combineLatest(
      this.store.select(getMatchers),
      this.matcherFilterSub.startWith([])
    ).map(([matchers, matcherFilter]) => {
      return matcherFilter.length === 0
        ? matchers
        : matchers.filter(e => matcherFilter.indexOf(e.status) >= 0)
    })

    this.showDetailID$ = this.store.select(getShowDetailID)
    this.initCurrentDetail()

    this.currentLogs$ = this.store.select(getLogs)
  }

  private initCurrentDetail(): void {
    // 根据list status和 show detail ID寻找当前推荐客户
    const items$: Observable<Customer[]> = this.listStatus$.mergeMap(
      listStatus => {
        if (listStatus === ListStatus.RECOMMEND) {
          return this.recommends$
        } else {
          return this.matchers$
        }
      }
    )

    this.currentDetail$ = this.showDetailID$.withLatestFrom(
      items$,
      (showDetailID, items) => {
        const detail = items.find(e => e.id === showDetailID)
        console.log(detail)
        return detail
      }
    )
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    this.initRecommendFilter()
    // this.initMatcherFilter()
    this.initLoadMore()
    this.initFetchLogger()
  }
  private initListHeaderChange(): void {
    this.listStatusChangeSub
      .takeUntil(this.destroyService)
      .subscribe(listStatus => {
        console.log(`list status: ${listStatus}`)
        this.store.dispatch(new ChangeListStatusAction(listStatus))
      })
  }

  private initListHeaderEvent(): void {
    this.headerEventSub
      .takeUntil(this.destroyService)
      .subscribe(headerEvent => {
        switch (headerEvent) {
          case ListHeaderEvent.BATCH_ACCEPT:
            console.log('batch accept')
            break
          case ListHeaderEvent.BATCH_CANCEL:
            console.log('batch cancel')
            break
          case ListHeaderEvent.BATCH_DELETE:
            console.log('batch delete')
            break
          case ListHeaderEvent.BATCH_HIDDEN:
            console.log('batch hidden')
            break
          case ListHeaderEvent.BATCH_INVITE:
            console.log('batch invite')
            break
          case ListHeaderEvent.BATCH_REFUSE:
            console.log('batch refuse')
            break

          default:
            console.warn(`Unknown recommend header event: ${headerEvent}`)
            break
        }

        this.toastCtrl
          .create({
            message: '吐血研发中...',
            position: 'top',
            duration: 3e3
          })
          .present()
      })
  }

  private initRecommendFilter(): void {
    this.recommendFilterSub
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        const params: FetchRecommendParams = {
          ...recommendFilter,
          pageIndex: 1,
          pageSize: 10
        }
        this.store.dispatch(new FetchRecommendAction(params))
      })
  }

  // private initMatcherFilter(): void {
  //   this.matcherFilterSub
  //     .takeUntil(this.destroyService)
  //     .subscribe(matcherFilter => {
  //       this.store.dispatch(
  //         new FetchMatchersAction({
  //           pageIndex: 1,
  //           pageSize: 10,
  //           statuses: matcherFilter
  //         })
  //       )
  //     })
  // }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreRecommend(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreRecommend(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.RECOMMEND)
      .withLatestFrom(
        this.recommendFilterSub.startWith({
          type: '',
          area: '',
          key: ''
        }),
        (_, recommendFilter) => recommendFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log('to load more with recommend filter, ', recommendFilter)
      })
  }

  private initLoadMoreMatcher(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.MATCHER)
      .withLatestFrom(
        this.matcherFilterSub,
        (_, matcherFilter) => matcherFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        console.log('to load more with matcher filter, ', matcherFilter)
      })
  }

  private initFetchLogger(): void {
    this.showDetailID$.takeUntil(this.destroyService).subscribe(customerId => {
      if (customerId) {
        this.store.dispatch(new FetchLoggerAction(customerId))
      }
    })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchRecommendAction())
    this.store.dispatch(new FetchMatchersAction())
  }
}
