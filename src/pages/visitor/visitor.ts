import { Component, OnInit, OnDestroy } from '@angular/core'
import { NavController, ToastController, IonicPage } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Store } from '@ngrx/store'
import {
  State,
  getListStatus,
  getPageStatus,
  getShowDetailID,
  getVisitors,
  getMatchers,
  getLogs,
  getShowMatcherLoadMore,
  getShowVisitorLoadMore
} from './reducers/index'
import {
  ToCreateLoggerAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchVisitorsAction,
  FetchVisitorsCountAction,
  UpdateDetailIDAction,
  ToInviteVisitorAction,
  FetchLoggerAction,
  LoadMoreVisitorsAction
} from './actions/visitor.action'
import {
  FetchMatchersAction,
  FetchMatchersCountAction,
  ToCancelMatcherAction,
  ToAgreeMatcherAction,
  ToRefuseMatcherAction,
  LoadMoreMatchersAction
} from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  RecommendVisitor,
  Portray,
  FetchRecommendVisitorParams,
  VisitorFilter,
  AREA_OPTIONS
} from './models/visitor.model'
import { DestroyService } from '../../providers/destroy.service'

import { Logger } from '../customer/models/logger.model'
import { Visitor } from './models/visitor.model'
import { VisitorMatcher, VisitorMatcherStatus } from './models/matcher.model'

@IonicPage()
@Component({
  selector: 'page-visitor',
  templateUrl: 'visitor.html',
  providers: [DestroyService]
})
export class VisitorPage implements OnInit, OnDestroy {
  visitors$: Observable<RecommendVisitor[]>
  matchers$: Observable<VisitorMatcher[]>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<RecommendVisitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  visitorFilterSub: Subject<VisitorFilter> = new Subject<VisitorFilter>()
  matcherFilterSub: Subject<VisitorMatcherStatus[]> = new Subject<
    VisitorMatcherStatus[]
  >()
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
    this.store.dispatch(new ToInviteVisitorAction())
  }

  ensureCreateLog() {
    this.store.dispatch(new ToCreateLoggerAction())
  }

  ensureCancelMatcher(id: string) {
    console.log(`ensure cancel matcher id: ${id}`)
    this.store.dispatch(new ToCancelMatcherAction(id))
  }

  ensureAgreeMatcher(id: string) {
    console.log(`ensure agree matcher id: ${id}`)
    this.store.dispatch(new ToAgreeMatcherAction(id))
  }

  ensureRefuseMatcher(id: string) {
    console.log(`ensure refuse matcher id: ${id}`)
    this.store.dispatch(new ToRefuseMatcherAction(id))
  }

  private initDataSource() {
    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.visitors$ = this.store.select(getVisitors)
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

    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.VISITOR)
        .mergeMap(() => this.store.select(getShowVisitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.MATCHER)
        .mergeMap(() => this.store.select(getShowMatcherLoadMore))
    )
  }

  private initCurrentDetail(): void {
    // 根据list status和 show detail ID寻找当前推荐客户
    const latestItems$: Observable<Visitor[]> = Observable.combineLatest(
      Observable.merge(
        this.visitors$.withLatestFrom(this.matchers$, (visitors, matchers) => [
          visitors,
          matchers
        ]),
        this.matchers$.withLatestFrom(this.visitors$, (matchers, visitors) => [
          visitors,
          matchers
        ])
      ),
      this.listStatus$,
      ([visitors, matchers], listStatus) => {
        if (listStatus === ListStatus.VISITOR) {
          return visitors
        }
        if (listStatus === ListStatus.MATCHER) {
          return matchers
        }
      }
    )

    const clickGridItem$ = this.showDetailID$.withLatestFrom(
      latestItems$,
      (detailId, items) => {
        return items.find(e => e.id === detailId)
      }
    )

    this.currentDetail$ = Observable.merge(clickGridItem$)
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    this.initRecommendFilter()
    this.initMatcherFilter()
    this.initLoadMore()
    this.initFetchLogger()
  }
  private initListHeaderChange(): void {
    this.listStatusChangeSub
      .takeUntil(this.destroyService)
      .subscribe(listStatus => {
        this.store.dispatch(new ChangeListStatusAction(listStatus))
      })
  }

  private initListHeaderEvent(): void {
    this.headerEventSub
      .withLatestFrom(this.listStatus$, (headerEvent, listStatus) => ({
        headerEvent,
        listStatus
      }))
      .withLatestFrom(
        this.visitorFilterSub.startWith({
          area: '',
          type: '',
          key: ''
        }),
        ({ headerEvent, listStatus }, visitorFilter) => ({
          headerEvent,
          listStatus,
          visitorFilter
        })
      )
      .withLatestFrom(
        this.matcherFilterSub.startWith([]),
        ({ headerEvent, listStatus, visitorFilter }, matcherFilter) => ({
          headerEvent,
          listStatus,
          visitorFilter,
          matcherFilter
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(
        ({ headerEvent, listStatus, visitorFilter, matcherFilter }) => {
          switch (headerEvent) {
            case ListHeaderEvent.REFRESH:
              if (listStatus === ListStatus.VISITOR) {
                console.log(`to refresh visitor data`)
                this.store.dispatch(new FetchVisitorsAction(visitorFilter))
              }
              if (listStatus === ListStatus.MATCHER) {
                console.log(`to refresh visitor matcher data`)
                this.store.dispatch(
                  new FetchMatchersAction({ statuses: matcherFilter })
                )
              }
              break

            case ListHeaderEvent.BATCH_ACCEPT:
              console.log('batch accept')
              this.prompt()
              break
            case ListHeaderEvent.BATCH_CANCEL:
              console.log('batch cancel')
              this.prompt()
              break
            case ListHeaderEvent.BATCH_DELETE:
              console.log('batch delete')
              this.prompt()
              break
            case ListHeaderEvent.BATCH_HIDDEN:
              console.log('batch hidden')
              this.prompt()
              break
            case ListHeaderEvent.BATCH_INVITE:
              console.log('batch invite')
              this.prompt()
              break
            case ListHeaderEvent.BATCH_REFUSE:
              console.log('batch refuse')
              this.prompt()
              break

            default:
              console.warn(`Unknown recommend header event: ${headerEvent}`)
              break
          }
        }
      )
  }

  private prompt(): void {
    this.toastCtrl
      .create({
        message: '吐血研发中...',
        position: 'top',
        duration: 3e3
      })
      .present()
  }

  private initRecommendFilter(): void {
    this.visitorFilterSub
      .distinctUntilChanged((prev, curr) => {
        return (
          prev.area === curr.area &&
          prev.type === curr.type &&
          prev.key === curr.key
        )
      })
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log(recommendFilter)

        const params: FetchRecommendVisitorParams = {
          ...recommendFilter,
          pageIndex: 1,
          pageSize: 10
        }
        this.store.dispatch(new FetchVisitorsAction(params))
      })
  }

  private initMatcherFilter(): void {
    this.matcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        console.log(matcherFilter)

        this.store.dispatch(
          new FetchMatchersAction({
            pageIndex: 1,
            pageSize: 10,
            statuses: matcherFilter
          })
        )
      })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreVisitor(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreVisitor(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.VISITOR)
      .withLatestFrom(
        this.visitorFilterSub.startWith({
          type: '',
          area: '',
          key: ''
        }),
        (_, recommendFilter) => recommendFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log('to load more with recommend filter, ', recommendFilter)
        this.store.dispatch(new LoadMoreVisitorsAction(recommendFilter))
      })
  }

  private initLoadMoreMatcher(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.MATCHER)
      .withLatestFrom(
        this.matcherFilterSub.startWith([]),
        (_, matcherFilter) => matcherFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        console.log('to load more with matcher filter, ', matcherFilter)
        this.store.dispatch(new LoadMoreMatchersAction(matcherFilter))
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
    this.store.dispatch(new FetchVisitorsAction())
    this.store.dispatch(new FetchMatchersAction())
    this.store.dispatch(new FetchVisitorsCountAction())
    this.store.dispatch(new FetchMatchersCountAction())
  }
}
