import { Component, OnInit, OnDestroy } from '@angular/core'
import { NavController, ToastController, IonicPage } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Store } from '@ngrx/store'
import {
  State,
  getListStatus,
  getPageStatus,
  getExhibitorShowDetailID,
  getMatcherShowDetailID,
  getExhibitors,
  getMatchers,
  getCurrentLogs,
  getShowExhibitorLoadMore,
  getShowMatcherLoadMore,
  getCurrentExhibitorCount,
  getCurrentMatcherCount,
  getExhibitorShouldScrollToTop,
  getMatcherShouldScrollToTop,
  getExhibitorAreaFilters,
  getExhibitorTypeFilters
} from './reducers/index'
import {
  ToCreateLoggerAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchExhibitorsAction,
  UpdateExhibitorDetailIDAction,
  ToInviteExhibitorAction,
  ToShowProcuctAction,
  FetchLoggerAction,
  FetchExhibitorsCountAction,
  LoadMoreExhibitorsAction,
  FetchAreaFilterOptionsAction,
  FetchTypeFilterOptionsAction
} from './actions/exhibitor.action'
import {
  FetchMatchersAction,
  ToAgreeMatcherAction,
  ToCancelMatcherAction,
  ToRefuseMatcherAction,
  FetchMatchersCountAction,
  LoadMoreMatchersAction,
  UpdateMatcherDetailIDAction
} from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Exhibitor,
  Portray,
  ExhibitorFilter,
  Product,
  FilterOptions
} from './models/exhibitor.model'
import { Logger } from '../customer/models/logger.model'
import {
  ExhibitorMatcher,
  ExhibitorMatcherStatus
} from './models/matcher.model'

import { DestroyService } from '../../providers/destroy.service'

@IonicPage()
@Component({
  selector: 'page-exhibitors',
  templateUrl: 'exhibitors.html',
  providers: [DestroyService]
})
export class ExhibitorsPage implements OnInit, OnDestroy {
  exhibitors$: Observable<Exhibitor[]>
  currentExhibitorsTotal$: Observable<number>
  matchers$: Observable<ExhibitorMatcher[]>
  currentMatchersTotal$: Observable<number>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<Exhibitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>
  exhibitorShouldScrollToTop$: Observable<boolean>
  matcherShouldScrollToTop$: Observable<boolean>
  filterOptions$: Observable<FilterOptions[][]>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  exhibitorFilterSub: Subject<ExhibitorFilter> = new Subject<ExhibitorFilter>()
  matcherFilterSub: Subject<ExhibitorMatcherStatus[]> = new Subject<
    ExhibitorMatcherStatus[]
    >()
  loadMoreSub: Subject<void> = new Subject<void>()

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private store: Store<State>,
    private destroyService: DestroyService
  ) { }

  ngOnInit() {
    this.initDataSource()
    this.initSubscriber()
    this.initDispatch()
  }

  ngOnDestroy() { }

  loadMore() {
    this.loadMoreSub.next()
  }

  updateExhibitorDetailID(id: string) {
    this.store.dispatch(new UpdateExhibitorDetailIDAction(id))
  }

  updateMatcherDetailID(id: string) {
    this.store.dispatch(new UpdateMatcherDetailIDAction(id))
  }

  toggleLog() {
    this.store.dispatch(new TogglePageStatusAction())
  }

  ensureInvite() {
    this.store.dispatch(new ToInviteExhibitorAction())
  }

  ensureCreateLog() {
    this.store.dispatch(new ToCreateLoggerAction())
  }

  ensureEditLog(log: Logger) {
    console.log(`exhibitor edit log: ${log}`)
  }

  ensureShowProduct(product: Product) {
    this.store.dispatch(new ToShowProcuctAction(product))
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
    this.exhibitors$ = this.store.select(getExhibitors)
    this.currentExhibitorsTotal$ = this.store.select(getCurrentExhibitorCount)
    this.exhibitorShouldScrollToTop$ = this.store.select(
      getExhibitorShouldScrollToTop
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
      this.store.select(getExhibitorShowDetailID),
      this.store.select(getMatcherShowDetailID)
    )
    this.currentDetail$ = this.computeCurrentDetail()
    this.currentLogs$ = this.store.select(getCurrentLogs)
    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.EXHIBITOR)
        .mergeMap(() => this.store.select(getShowExhibitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.MATCHER)
        .mergeMap(() => this.store.select(getShowMatcherLoadMore))
    )

    this.filterOptions$ = Observable.combineLatest(
      this.store.select(getExhibitorAreaFilters),
      this.store.select(getExhibitorTypeFilters)
    ).map(([areaFilters, typeFilters]) => {
      return [areaFilters, typeFilters, [{ label: '默认排序', value: '0' }]]
    })
  }

  // 根据list status和 show detail ID寻找当前显示详情
  private computeCurrentDetail(): Observable<Exhibitor> {
    const latestExhibitor$ = Observable.combineLatest(
      this.store.select(getExhibitors),
      this.store.select(getExhibitorShowDetailID)
    ).map(([exhibitors, id]) => {
      const exhibitor = exhibitors.find(e => e.id === id)
      return exhibitor
    })
    const latestMatcher$ = Observable.combineLatest(
      this.store.select(getMatchers),
      this.store.select(getMatcherShowDetailID)
    ).map(([matchers, id]) => {
      const matcher = matchers.find(e => e.id === id)
      return matcher
    })

    return Observable.combineLatest(
      latestExhibitor$,
      latestMatcher$
    ).withLatestFrom(this.listStatus$, ([exhibitor, matcher], listStatus) => {
      if (listStatus === ListStatus.EXHIBITOR) {
        return exhibitor
      }
      if (listStatus === ListStatus.MATCHER) {
        return matcher
      }
    })
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    this.initExhibitorFilter()
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
      .subscribe(() => {
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
      this.exhibitorFilterSub.startWith({
        area: '',
        type: '',
        key: ''
      }),
      ({ headerEvent, listStatus }, exhibitorFilter) => ({
        headerEvent,
        listStatus,
        exhibitorFilter
      })
      )
      .withLatestFrom(
      this.matcherFilterSub.startWith([]),
      ({ headerEvent, listStatus, exhibitorFilter }, matcherFilter) => ({
        headerEvent,
        listStatus,
        exhibitorFilter,
        matcherFilter
      })
      )
      .takeUntil(this.destroyService)
      .subscribe(
      ({ headerEvent, listStatus, exhibitorFilter, matcherFilter }) => {
        switch (headerEvent) {
          case ListHeaderEvent.REFRESH:
            if (listStatus === ListStatus.EXHIBITOR) {
              this.store.dispatch(
                new FetchExhibitorsAction({
                  ...exhibitorFilter,
                  pageIndex: 1,
                  pageSize: 10
                })
              )
            }
            if (listStatus === ListStatus.MATCHER) {
              console.log(matcherFilter)
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

  private initExhibitorFilter(): void {
    this.exhibitorFilterSub
      .distinctUntilChanged((prev, curr) => {
        return (
          prev.area === curr.area &&
          prev.type === curr.type &&
          prev.key === curr.key
        )
      })
      .takeUntil(this.destroyService)
      .subscribe(exhibitorFilter => {
        this.store.dispatch(
          new FetchExhibitorsAction({
            ...exhibitorFilter,
            pageIndex: 1,
            pageSize: 10
          })
        )
        this.store.dispatch(new FetchExhibitorsCountAction(exhibitorFilter))
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

    this.initLoadMoreExhibitor(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreExhibitor(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.EXHIBITOR)
      .withLatestFrom(
      this.exhibitorFilterSub.startWith({
        type: '',
        area: '',
        key: ''
      }),
      (_, recommendFilter) => recommendFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(exhibitorFilter => {
        this.store.dispatch(new LoadMoreExhibitorsAction(exhibitorFilter))
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
    this.showDetailID$.takeUntil(this.destroyService).subscribe(exhibitorId => {
      if (exhibitorId) {
        this.store.dispatch(new FetchLoggerAction(exhibitorId))
      }
    })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchExhibitorsAction())
    this.store.dispatch(new FetchExhibitorsCountAction())

    this.store.dispatch(new FetchAreaFilterOptionsAction())
    this.store.dispatch(new FetchTypeFilterOptionsAction())
  }
}
