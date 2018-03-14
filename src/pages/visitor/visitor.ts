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
  getToDoMatchers,
  getLogs,
  getShowToDoMatcherLoadMore,
  getShowVisitorLoadMore,
  getCurrentVisitorCount,
  getCurrentToDoMatcherCount,
  getVisitorShouldScrollToTop,
  getToDoMatcherShouldScrollToTop,
  getVisitorAreaFilters,
  getVisitorTypeFilters,
  getCompleteMatchers,
  getCompleteMatcherTotalCount,
  getCompleteMatcherDetailID,
  getShowCompleteMatcherLoadMore
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
  FetchTypeFilterOptionsAction
} from './actions/visitor.action'
import {
  FetchToDoMatchersAction,
  FetchToDoMatchersCountAction,
  ToAgreeMatcherAction,
  ToRefuseMatcherAction,
  LoadMoreToDoMatchersAction
} from './actions/todo-matcher.action'

import {
  FetchCompleteMatchersAction,
  FetchCompleteMatchersCountAction,
  LoadMoreCompleteMatchersAction,
  UpdateMatcherDetailIDAction
} from './actions/complete-matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Visitor,
  Portray,
  VisitorFilter,
  FilterOptions
} from './models/visitor.model'
import { DestroyService } from '../../providers/destroy.service'

import { Logger } from '../customer/models/logger.model'
import {
  VisitorMatcher,
  VisitorMatcherStatus,
  VisitorMatcherDirection
} from './models/matcher.model'
import { ToDoFilterOptions } from './components/matcher-filter/matcher-filter.component'
import { GridFilterType } from '../../shared/components/grid-filter/grid-filter.component'

@IonicPage()
@Component({
  selector: 'page-visitor',
  templateUrl: 'visitor.html',
  providers: [DestroyService]
})
export class VisitorPage implements OnInit, OnDestroy {
  gridFilterType = GridFilterType.VISITOR

  VISITOR_GRID = ListStatus.VISITOR
  TODO_MATCHER_GRID = ListStatus.TODO
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE

  LIST_PAGE = PageStatus.LIST
  DETAIL_PAGE = PageStatus.DETAIL

  visitors$: Observable<Visitor[]>
  currentVisitorsTotal$: Observable<number>
  toDoMatchers$: Observable<VisitorMatcher[]>
  toDoMatchersTotal$: Observable<number>
  completeMatchers$: Observable<VisitorMatcher[]>
  completeMatchersTotal$: Observable<number>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<Visitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>
  visitorShouldScrollToTop$: Observable<boolean>
  matcherShouldScrollToTop$: Observable<boolean>
  filterOptions$: Observable<FilterOptions[][]>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  visitorFilterSub: Subject<VisitorFilter> = new Subject<VisitorFilter>()
  toDoMatcherFilterSub: Subject<ToDoFilterOptions> = new Subject<
    ToDoFilterOptions
  >()
  completeMatcherFilterSub: Subject<VisitorMatcherDirection> = new Subject<
    VisitorMatcherDirection
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

  ionViewEnter() {
    console.log('view enter visitor module')
  }

  ensureToDoFilter(filter: ToDoFilterOptions) {
    this.toDoMatcherFilterSub.next(filter)
  }

  ensureCompleteFilter(filter: VisitorMatcherDirection) {
    this.completeMatcherFilterSub.next(filter)
  }

  ngOnDestroy() {}

  loadMore() {
    this.loadMoreSub.next()
  }

  toInvite(id: string) {
    console.log(`to modal for invite visitor of id: ${id}`)
  }

  updateVisitorDetailID(id: string) {
    // this.store.dispatch(new UpdateVisitorDetailIDAction(id))
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
      getToDoMatcherShouldScrollToTop
    )

    // TODO 当前实现为 前台过滤约请状态 后面改为后台实现
    this.toDoMatchers$ = this.store.select(getToDoMatchers)
    this.toDoMatchersTotal$ = this.store.select(getCurrentToDoMatcherCount)
    this.completeMatchers$ = this.store.select(getCompleteMatchers)
    this.completeMatchersTotal$ = this.store.select(
      getCompleteMatcherTotalCount
    )

    this.showDetailID$ = this.store.select(getCompleteMatcherDetailID)
    this.currentDetail$ = this.showDetailID$
      .withLatestFrom(this.completeMatchers$)
      .map(([id, matchers]) => matchers.find(e => e.id === id))
    this.currentLogs$ = this.store.select(getLogs)
    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.VISITOR)
        .mergeMap(() => this.store.select(getShowVisitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.TODO)
        .mergeMap(() => this.store.select(getShowToDoMatcherLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.COMPLETE)
        .mergeMap(() => this.store.select(getShowCompleteMatcherLoadMore))
    )

    this.filterOptions$ = Observable.combineLatest(
      this.store.select(getVisitorAreaFilters),
      this.store.select(getVisitorTypeFilters)
    ).map(([areaFilters, typeFilters]) => {
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

  private initSubscriber() {
    this.initListHeaderChange()

    this.initVisitorFilter()
    this.initToDoMatcherFilter()
    this.initCompleteMatcherFilter()
    this.initLoadMore()
    this.initFetchLogger()
  }
  private initListHeaderChange(): void {
    this.initChageListStatus()

    const sameWithLast$ = this.listStatusChangeSub
      .pairwise()
      .filter(([prev, curr]) => prev === curr)

    this.initFetchToDoMatcher(sameWithLast$)
    this.initFetchCompleteMatcher(sameWithLast$)
    this.initFetchVisitor(sameWithLast$)
  }

  private initChageListStatus() {
    this.listStatusChangeSub
      .takeUntil(this.destroyService)
      .subscribe(listStatus => {
        this.store.dispatch(new ChangeListStatusAction(listStatus))
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
            pageSize: 10,
            statuses: [VisitorMatcherStatus.ANY],
            direction: VisitorMatcherDirection.ANY
          })
        )
        this.store.dispatch(
          new FetchToDoMatchersCountAction({
            status: VisitorMatcherStatus.ANY,
            direction: VisitorMatcherDirection.ANY
          })
        )
      })

    const sameWithLastToDoMatchFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.TODO)
      .withLatestFrom(
        this.toDoMatcherFilterSub.startWith({
          status: VisitorMatcherStatus.ANY,
          direction: VisitorMatcherDirection.ANY
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, filter]) => {
        this.store.dispatch(
          new FetchToDoMatchersAction({
            pageIndex: 1,
            pageSize: 10,
            statuses: [filter.status],
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
            pageSize: 10,
            statuses: [VisitorMatcherStatus.AGREE],
            direction: VisitorMatcherDirection.ANY
          })
        )
        this.store.dispatch(
          new FetchCompleteMatchersCountAction(VisitorMatcherDirection.ANY)
        )
      })

    const sameWithLastCompleteMatchFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.COMPLETE)
      .withLatestFrom(
        this.completeMatcherFilterSub.startWith(VisitorMatcherDirection.ANY)
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, direction]) => {
        this.store.dispatch(
          new FetchCompleteMatchersAction({
            pageIndex: 1,
            pageSize: 10,
            statuses: [VisitorMatcherStatus.AGREE],
            direction: direction
          })
        )
      })
  }

  private initFetchVisitor(
    sameWithLast$: Observable<[ListStatus, ListStatus]>
  ) {
    const sameWithLastVisitorFetch$ = sameWithLast$
      .filter(([e, _]) => e === ListStatus.VISITOR)
      .withLatestFrom(
        this.visitorFilterSub.startWith({
          type: '',
          area: '',
          key: ''
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(([_, filter]) => {
        this.store.dispatch(new FetchVisitorsAction(filter))
      })
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

  private initToDoMatcherFilter(): void {
    this.toDoMatcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(
          new FetchToDoMatchersAction({
            pageIndex: 1,
            pageSize: 10,
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
            pageSize: 10,
            statuses: [VisitorMatcherStatus.AGREE],
            direction
          })
        )
        this.store.dispatch(new FetchCompleteMatchersCountAction(direction))
      })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreVisitor(loadMore$)
    this.initLoadMoreToDoMatcher(loadMore$)
    this.initLoadMoreCompleteMatcher(loadMore$)
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

  private initLoadMoreToDoMatcher(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.TODO)
      .withLatestFrom(
        this.toDoMatcherFilterSub.startWith({
          status: VisitorMatcherStatus.ANY,
          direction: VisitorMatcherDirection.ANY
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
        this.completeMatcherFilterSub.startWith(VisitorMatcherDirection.ANY),
        (_, matcherFilter) => matcherFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        this.store.dispatch(new LoadMoreCompleteMatchersAction(matcherFilter))
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
