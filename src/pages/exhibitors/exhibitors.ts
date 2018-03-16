import { Component, OnInit, OnDestroy, Inject } from '@angular/core'
import { NavController, ToastController, IonicPage } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'

import { Store } from '@ngrx/store'
import {
  State,
  getListStatus,
  getPageStatus,
  getExhibitorShowDetailID,
  getToDoMatcherShowDetailID,
  getExhibitors,
  getToDoMatchers,
  getCurrentLogs,
  getShowExhibitorLoadMore,
  getShowToDoMatcherLoadMore,
  getCurrentExhibitorCount,
  getCurrentToDoMatcherCount,
  getExhibitorShouldScrollToTop,
  getToDoMatcherShouldScrollToTop,
  getExhibitorAreaFilters,
  getExhibitorTypeFilters,
  getCompleteMatchers,
  getCurrentCompleteMatcherCount,
  getCompleteMatcherShouldScrollToTop,
  getCompleteMatcherShowDetailID,
  getShowCompleteMatcherLoadMore
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
  FetchTypeFilterOptionsAction,
  ToInviteExhibitorToMicroAppAction,
  ChangePageStatusAction
} from './actions/exhibitor.action'
import {
  FetchToDoMatchersAction,
  ToAgreeToDoMatcherAction,
  ToRefuseToDoMatcherAction,
  FetchToDoMatchersCountAction,
  LoadMoreToDoMatchersAction,
  UpdateToDoMatcherDetailIDAction,
  ToBatchAgreeToDoMatchersAction
} from './actions/todo-matcher.action'

import {
  FetchCompleteMatchersAction,
  FetchCompleteMatchersCountAction,
  UpdateCompleteMatcherDetailIDAction,
  LoadMoreCompleteMatchersAction
} from './actions/complete-matcher.action'

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
  ExhibitorMatcherStatus,
  ExhibitorMatcherDirection
} from './models/matcher.model'

import { DestroyService } from '../../providers/destroy.service'
import { GridFilterType } from '../../shared/components/grid-filter/grid-filter.component'
import { ToDoFilterOptions } from './components/matcher-filter/matcher-filter.component'

@IonicPage()
@Component({
  selector: 'page-exhibitors',
  templateUrl: 'exhibitors.html',
  providers: [DestroyService]
})
export class ExhibitorsPage implements OnInit {
  gridFilterType = GridFilterType.EXHIBITOR

  EXHIBITOR_GRID = ListStatus.EXHIBITOR
  TODO_MATCHER_GRID = ListStatus.TODO
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE

  LIST_PAGE = PageStatus.LIST
  DETAIL_PAGE = PageStatus.DETAIL

  exhibitors$: Observable<Exhibitor[]>
  currentExhibitorsTotal$: Observable<number>
  toDoMatchers$: Observable<ExhibitorMatcher[]>
  completeMatchers$: Observable<ExhibitorMatcher[]>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentExhibitorDetail$: Observable<Exhibitor>
  currentExhibitorMatcherDetail$: Observable<ExhibitorMatcher>
  currentLogs$: Observable<Logger[]>
  // TODO
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>
  exhibitorShouldScrollToTop$: Observable<boolean>
  toDoMatcherShouldScrollToTop$: Observable<boolean>
  completeMatcherShouldScrollToTop$: Observable<boolean>
  filterOptions$: Observable<FilterOptions[][]>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  exhibitorFilterSub: Subject<ExhibitorFilter> = new Subject<ExhibitorFilter>()
  toDoMatcherFilterSub: Subject<ToDoFilterOptions> = new Subject<
    ToDoFilterOptions
  >()
  completeMatcherFilterSub: Subject<ExhibitorMatcherDirection> = new Subject<
    ExhibitorMatcherDirection
  >()
  loadMoreSub: Subject<void> = new Subject<void>()

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private store: Store<State>,
    private destroyService: DestroyService,
    @Inject('DEFAULT_PAGE_SIZE') private pageSize
  ) {}

  ngOnInit() {
    this.initDataSource()
    this.initSubscriber()
    this.initDispatch()
  }

  ensureToDoFilter(filter: ToDoFilterOptions) {
    this.toDoMatcherFilterSub.next(filter)
  }

  ensureCompleteFilter(filter: ExhibitorMatcherDirection) {
    this.completeMatcherFilterSub.next(filter)
  }

  ensureBatchAgree() {
    this.store.dispatch(new ToBatchAgreeToDoMatchersAction())
  }

  ensureInvite() {
    this.store.dispatch(new ToInviteExhibitorToMicroAppAction())
  }

  updateExhibitorDetailID(id: string) {
    this.store.dispatch(new UpdateExhibitorDetailIDAction(id))
  }

  loadMore() {
    this.loadMoreSub.next()
  }

  updateToDoMatcherDetailID(id: string) {
    this.store.dispatch(new UpdateToDoMatcherDetailIDAction(id))
  }

  updateCompleteMatcherDetailID(id: string) {
    this.store.dispatch(new UpdateCompleteMatcherDetailIDAction(id))
  }

  toggleLog() {
    this.store.dispatch(new TogglePageStatusAction())
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

  ensureAgreeMatcher(id: string) {
    this.store.dispatch(new ToAgreeToDoMatcherAction(id))
  }

  ensureRefuseMatcher(id: string) {
    this.store.dispatch(new ToRefuseToDoMatcherAction(id))
  }

  private initDataSource() {
    this.exhibitors$ = this.store.select(getExhibitors)
    this.currentExhibitorsTotal$ = this.store.select(getCurrentExhibitorCount)
    this.toDoMatchers$ = this.store.select(getToDoMatchers)
    this.completeMatchers$ = this.store.select(getCompleteMatchers)

    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.showDetailID$ = Observable.merge(
      this.store.select(getExhibitorShowDetailID),
      this.store.select(getToDoMatcherShowDetailID),
      this.store.select(getCompleteMatcherShowDetailID)
    )

    this.initCurrentDetail()
    this.currentLogs$ = this.store.select(getCurrentLogs)
    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.EXHIBITOR)
        .mergeMap(() => this.store.select(getShowExhibitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.TODO)
        .mergeMap(() => this.store.select(getShowToDoMatcherLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.COMPLETE)
        .mergeMap(() => this.store.select(getShowCompleteMatcherLoadMore))
    )

    this.exhibitorShouldScrollToTop$ = this.store.select(
      getExhibitorShouldScrollToTop
    )
    this.toDoMatcherShouldScrollToTop$ = this.store.select(
      getToDoMatcherShouldScrollToTop
    )
    this.completeMatcherShouldScrollToTop$ = this.store.select(
      getCompleteMatcherShouldScrollToTop
    )

    this.filterOptions$ = Observable.combineLatest(
      this.store.select(getExhibitorAreaFilters),
      this.store.select(getExhibitorTypeFilters)
    ).map(([areaFilters, typeFilters]) => {
      return [areaFilters, typeFilters, [{ label: '默认排序', value: '0' }]]
    })
  }

  // 根据list status和 show detail ID寻找当前显示详情
  private initCurrentDetail(): void {
    const latestExhibitor$ = Observable.combineLatest(
      this.store.select(getExhibitors),
      this.store.select(getExhibitorShowDetailID)
    )
      .map(([exhibitors, id]) => {
        const exhibitor = exhibitors.find(e => e.id === id)
        return exhibitor
      })
      .withLatestFrom(this.listStatus$)
      .filter(
        ([matcher, listStatus]) =>
          matcher && listStatus === ListStatus.EXHIBITOR
      )
      .map(([matcher, _]) => matcher)

    const latestToDoMatcher$ = Observable.combineLatest(
      this.store.select(getToDoMatchers),
      this.store.select(getToDoMatcherShowDetailID)
    )
      .map(([matchers, id]) => {
        const matcher = matchers.find(e => e.id === id)
        return matcher
      })
      .withLatestFrom(this.listStatus$)
      .filter(
        ([matcher, listStatus]) => matcher && listStatus === ListStatus.TODO
      )
      .map(([matcher, _]) => matcher)

    const latestCompleteMatcher$ = Observable.combineLatest(
      this.store.select(getCompleteMatchers),
      this.store.select(getCompleteMatcherShowDetailID)
    )
      .map(([matchers, id]) => {
        const matcher = matchers.find(e => e.id === id)
        return matcher
      })
      .withLatestFrom(this.listStatus$)
      .filter(
        ([matcher, listStatus]) => matcher && listStatus === ListStatus.COMPLETE
      )
      .map(([matcher, _]) => matcher)

    this.currentExhibitorDetail$ = Observable.merge(
      latestExhibitor$,
      latestToDoMatcher$.map(e => e.toShow),
      latestCompleteMatcher$.map(e => e.toShow)
    )

    this.currentExhibitorMatcherDetail$ = Observable.merge(
      latestToDoMatcher$,
      latestCompleteMatcher$
    )
  }

  private initSubscriber() {
    this.initListHeaderChange()

    this.initExhibitorFilter()
    this.initToDoMatcherFilter()
    this.initCompleteMatcherFilter()
    this.initLoadMore()
    this.initFetchLogger()
  }
  private initListHeaderChange(): void {
    this.initChangeListStatus()

    const sameWithLast$ = this.listStatusChangeSub
      .pairwise()
      .filter(([prev, curr]) => prev === curr)

    this.initFetchToDoMatcher(sameWithLast$)
    this.initFetchCompleteMatcher(sameWithLast$)
    this.initFetchExhibitor(sameWithLast$)
  }

  private initChangeListStatus() {
    this.listStatusChangeSub
      .takeUntil(this.destroyService)
      .subscribe(listStatus => {
        this.store.dispatch(new ChangeListStatusAction(listStatus))
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
      })
  }

  private initFetchToDoMatcher(
    sameWithLast$: Observable<[ListStatus, ListStatus]>
  ) {
    const firstToDoMatchFetch$ = this.listStatusChangeSub
      .filter(listStatus => listStatus === ListStatus.TODO)
      .take(1)
      .subscribe(() => {
        this.store.dispatch(
          new FetchToDoMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [ExhibitorMatcherStatus.ANY],
            direction: ExhibitorMatcherDirection.ANY
          })
        )
        this.store.dispatch(
          new FetchToDoMatchersCountAction({
            status: ExhibitorMatcherStatus.ANY,
            direction: ExhibitorMatcherDirection.ANY
          })
        )
      })

    const sameWithLastToDoMatchFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.TODO)
      .withLatestFrom(
        this.toDoMatcherFilterSub.startWith({
          status: ExhibitorMatcherStatus.ANY,
          direction: ExhibitorMatcherDirection.ANY
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, filter]) => {
        this.store.dispatch(
          new FetchToDoMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [filter.status],
            direction: filter.direction
          })
        )

        this.store.dispatch(
          new FetchToDoMatchersCountAction({
            status: filter.status,
            direction: filter.direction
          })
        )
      })
  }

  private initFetchCompleteMatcher(
    sameWithLast$: Observable<[ListStatus, ListStatus]>
  ) {
    const firstCompleteMatchFetch$ = this.listStatusChangeSub
      .filter(listStatus => listStatus === ListStatus.COMPLETE)
      .take(1)
      .subscribe(() => {
        this.store.dispatch(
          new FetchCompleteMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [ExhibitorMatcherStatus.AGREE],
            direction: ExhibitorMatcherDirection.ANY
          })
        )
        this.store.dispatch(
          new FetchCompleteMatchersCountAction(ExhibitorMatcherDirection.ANY)
        )
      })

    const sameWithLastCompleteMatchFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.COMPLETE)
      .withLatestFrom(
        this.completeMatcherFilterSub.startWith(ExhibitorMatcherDirection.ANY)
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, direction]) => {
        this.store.dispatch(
          new FetchCompleteMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [ExhibitorMatcherStatus.AGREE],
            direction: direction
          })
        )

        this.store.dispatch(new FetchCompleteMatchersCountAction(direction))
      })
  }

  private initFetchExhibitor(
    sameWithLast$: Observable<[ListStatus, ListStatus]>
  ) {
    const sameWithLastExhibitorFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.EXHIBITOR)
      .withLatestFrom(
        this.exhibitorFilterSub.startWith({
          type: '',
          area: '',
          key: ''
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, filter]) => {
        this.store.dispatch(
          new FetchExhibitorsAction({
            ...filter,
            pageIndex: 1,
            pageSize: this.pageSize
          })
        )

        this.store.dispatch(new FetchExhibitorsCountAction({ ...filter }))
      })
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
            pageSize: this.pageSize
          })
        )
        this.store.dispatch(new FetchExhibitorsCountAction(exhibitorFilter))
      })
  }

  private initToDoMatcherFilter(): void {
    this.toDoMatcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(
          new FetchToDoMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [matcherFilter.status],
            direction: matcherFilter.direction
          })
        )
        this.store.dispatch(new FetchToDoMatchersCountAction(matcherFilter))
      })
  }

  private initCompleteMatcherFilter(): void {
    this.completeMatcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(direction => {
        this.store.dispatch(
          new FetchCompleteMatchersAction({
            pageIndex: 1,
            pageSize: this.pageSize,
            statuses: [ExhibitorMatcherStatus.AGREE],
            direction
          })
        )
        this.store.dispatch(new FetchCompleteMatchersCountAction(direction))
      })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .debounceTime(2e2)
      .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreExhibitor(loadMore$)
    this.initLoadMoreToDoMatcher(loadMore$)
    this.initLoadMoreCompleteMatcher(loadMore$)
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

  private initLoadMoreToDoMatcher(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.TODO)
      .withLatestFrom(
        this.toDoMatcherFilterSub.startWith({
          status: ExhibitorMatcherStatus.ANY,
          direction: ExhibitorMatcherDirection.ANY
        }),
        (_, matcherFilter) => matcherFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(new LoadMoreToDoMatchersAction(matcherFilter))
      })
  }

  private initLoadMoreCompleteMatcher(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.COMPLETE)
      .withLatestFrom(
        this.completeMatcherFilterSub.startWith(ExhibitorMatcherDirection.ANY),
        (_, matcherFilter) => matcherFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(new LoadMoreCompleteMatchersAction(matcherFilter))
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
    this.store.dispatch(
      new FetchExhibitorsAction({
        pageIndex: 1,
        pageSize: this.pageSize
      })
    )
    this.store.dispatch(new FetchExhibitorsCountAction())

    this.store.dispatch(new FetchAreaFilterOptionsAction())
    this.store.dispatch(new FetchTypeFilterOptionsAction())
  }
}
