import { Component, OnInit, OnDestroy } from '@angular/core'
import { NavController, ToastController, IonicPage } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Store } from '@ngrx/store'
import {
  State,
  getListStatus,
  getPageStatus,
  getVisitorShowDetailID,
  getVisitors,
  getMatchers,
  getLogs,
  getShowMatcherLoadMore,
  getShowVisitorLoadMore,
  getCurrentVisitorCount,
  getCurrentMatcherCount,
  getVisitorShouldScrollToTop,
  getMatcherShowDetailID,
  getMatcherShouldScrollToTop,
  getVisitorAreaFilters,
  getVisitorTypeFilters,
} from './reducers/index'
import {
  ToCreateLoggerAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchVisitorsAction,
  FetchVisitorsCountAction,
  UpdateVisitorDetailIDAction,
  ToInviteVisitorAction,
  FetchLoggerAction,
  LoadMoreVisitorsAction,
  FetchAreaFilterOptionsAction,
  FetchTypeFilterOptionsAction,
} from './actions/visitor.action'
import {
  FetchMatchersAction,
  FetchMatchersCountAction,
  ToCancelMatcherAction,
  ToAgreeMatcherAction,
  ToRefuseMatcherAction,
  LoadMoreMatchersAction,
  UpdateMatcherDetailIDAction
} from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  RecommendVisitor,
  Portray,
  VisitorFilter,
  FilterOptions,
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
  currentVisitorsTotal$: Observable<number>
  matchers$: Observable<VisitorMatcher[]>
  currentMatchersTotal$: Observable<number>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<RecommendVisitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>
  visitorShouldScrollToTop$: Observable<boolean>
  matcherShouldScrollToTop$: Observable<boolean>
  filterOptions$: Observable<FilterOptions[][]>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  visitorFilterSub: Subject<VisitorFilter> = new Subject<VisitorFilter>()
  matcherFilterSub: Subject<VisitorMatcherStatus[]> = new Subject<
    VisitorMatcherStatus[]
  >()
  loadMoreSub: Subject<void> = new Subject<void>()

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

  updateVisitorDetailID(id: string) {
    this.store.dispatch(new UpdateVisitorDetailIDAction(id))
  }

  updateMatcherDetailID(id: string) {
    this.store.dispatch(new UpdateMatcherDetailIDAction(id))
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

  ensureEditLog(log: Logger) {
    console.log(`visitor to edit log: ${log}`)
  }

  ensureCancelMatcher(id: string) {
    this.store.dispatch(new ToCancelMatcherAction(id))
  }

  ensureAgreeMatcher(id: string) {
    this.store.dispatch(new ToAgreeMatcherAction(id))
  }

  ensureRefuseMatcher(id: string) {
    this.store.dispatch(new ToRefuseMatcherAction(id))
  }

  private initDataSource() {
    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.visitors$ = this.store.select(getVisitors)
    this.currentVisitorsTotal$ = this.store.select(getCurrentVisitorCount)
    this.visitorShouldScrollToTop$ = this.store.select(
      getVisitorShouldScrollToTop
    )
    this.matcherShouldScrollToTop$ = this.store.select(
      getMatcherShouldScrollToTop
    )

    // TODO 当前实现为 前台过滤约请状态 后面改为后台实现
    this.matchers$ = Observable.combineLatest(
      this.store.select(getMatchers),
      this.matcherFilterSub.startWith([])
    ).map(([matchers, matcherFilter]) => {
      return matcherFilter.length === 0
        ? matchers
        : matchers.filter(e => matcherFilter.indexOf(e.status) >= 0)
    })
    this.currentMatchersTotal$ = this.store.select(getCurrentMatcherCount)

    this.showDetailID$ = Observable.merge(
      this.store.select(getVisitorShowDetailID),
      this.store.select(getMatcherShowDetailID)
    )
    this.currentDetail$ = this.computeCurrentDetail()
    this.currentLogs$ = this.store.select(getLogs)
    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.VISITOR)
        .mergeMap(() => this.store.select(getShowVisitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.MATCHER)
        .mergeMap(() => this.store.select(getShowMatcherLoadMore))
    )

    this.filterOptions$ = Observable.combineLatest(
      this.store.select(getVisitorAreaFilters),
      this.store.select(getVisitorTypeFilters)
    )
    .map(([areaFilters, typeFilters]) => {
      return [
        areaFilters,
        typeFilters,
        [
          {
            label: '默认排序',
            value: '0'
          }
        ]
      ]
    })
  }

  private computeCurrentDetail(): Observable<RecommendVisitor> {
    // 根据list status和 show detail ID寻找当前推荐客户
    const latestVisitor$ = Observable.combineLatest(
      this.store.select(getVisitors),
      this.store.select(getVisitorShowDetailID)
    )
    .map(([visitors, id]) => {
      const visitor = visitors.find(e => e.id === id)
      return visitor
    })
    const latestMatcher$ = Observable.combineLatest(
      this.store.select(getMatchers),
      this.store.select(getMatcherShowDetailID)
    )
    .map(([matchers, id]) => {
      const matcher = matchers.find(e => e.id === id)
      return matcher
    })

    return Observable.combineLatest(
      latestVisitor$,
      latestMatcher$
    )
    .withLatestFrom(this.listStatus$, ([visitor, matcher], listStatus) => {
      if (listStatus === ListStatus.VISITOR) {
        return visitor
      }
      if (listStatus === ListStatus.MATCHER) {
        return matcher
      }
    })
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    this.initVisitorFilter()
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

    this.listStatusChangeSub
      .filter(listStatus => listStatus === ListStatus.MATCHER)
      .take(1)
      .subscribe(_ => {
        this.store.dispatch(new FetchMatchersAction())
        this.store.dispatch(new FetchMatchersCountAction())
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
                this.store.dispatch(
                  new FetchVisitorsAction({
                    ...visitorFilter,
                    pageIndex: 1,
                    pageSize: 10
                  })
                )
              }
              if (listStatus === ListStatus.MATCHER) {
                this.store.dispatch(
                  new FetchMatchersAction({
                    statuses: matcherFilter,
                    pageIndex: 1,
                    pageSize: 10
                  })
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

  private initVisitorFilter(): void {
    this.visitorFilterSub
      .distinctUntilChanged((prev, curr) => {
        return (
          prev.area === curr.area &&
          prev.type === curr.type &&
          prev.key === curr.key
        )
      })
      .takeUntil(this.destroyService)
      .subscribe(visitorFilter => {
        this.store.dispatch(
          new FetchVisitorsAction({
            ...visitorFilter,
            pageIndex: 1,
            pageSize: 10
          })
        )
        this.store.dispatch(new FetchVisitorsCountAction(visitorFilter))
      })
  }

  private initMatcherFilter(): void {
    this.matcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(
          new FetchMatchersAction({
            pageIndex: 1,
            pageSize: 10,
            statuses: matcherFilter
          })
        )
        this.store.dispatch(new FetchMatchersCountAction(matcherFilter))
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
      .subscribe(visitorFilter => {
        this.store.dispatch(new LoadMoreVisitorsAction(visitorFilter))
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
        this.store.dispatch(new LoadMoreMatchersAction(matcherFilter))
      })
  }

  private initFetchLogger(): void {
    this.showDetailID$.takeUntil(this.destroyService).subscribe(visitorId => {
      if (visitorId) {
        this.store.dispatch(new FetchLoggerAction(visitorId))
      }
    })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchVisitorsAction())
    this.store.dispatch(new FetchVisitorsCountAction())
    this.store.dispatch(new FetchAreaFilterOptionsAction())
    this.store.dispatch(new FetchTypeFilterOptionsAction())
  }
}
