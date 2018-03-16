import { Component, OnInit, OnDestroy, Inject } from '@angular/core'
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
  getShowCompleteMatcherLoadMore,
  getCompleteMatcherShouldScrollToTop
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
  ToInviteVisitorToMicroAppAction,
  ChangePageStatusAction
} from './actions/visitor.action'
import {
  FetchToDoMatchersAction,
  FetchToDoMatchersCountAction,
  ToAgreeToDoMatcherAction,
  ToRefuseToDoMatcherAction,
  LoadMoreToDoMatchersAction,
  ToBatchAgreeToDoMatchersAction
} from './actions/todo-matcher.action'

import {
  FetchCompleteMatchersAction,
  FetchCompleteMatchersCountAction,
  LoadMoreCompleteMatchersAction,
  UpdateCompleteMatcherDetailIDAction
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
export class VisitorPage implements OnInit {
  gridFilterType = GridFilterType.VISITOR

  VISITOR_GRID = ListStatus.VISITOR
  TODO_MATCHER_GRID = ListStatus.TODO
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE

  LIST_PAGE = PageStatus.LIST
  DETAIL_PAGE = PageStatus.DETAIL

  visitors$: Observable<Visitor[]>
  currentVisitorsTotal$: Observable<number>
  toDoMatchers$: Observable<VisitorMatcher[]>
  completeMatchers$: Observable<VisitorMatcher[]>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<Visitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>
  visitorShouldScrollToTop$: Observable<boolean>
  toDoMatcherShouldScrollToTop$: Observable<boolean>
  completeMatcherShouldScrollToTop$: Observable<boolean>
  filterOptions$: Observable<FilterOptions[][]>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
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

  ensureCompleteFilter(filter: VisitorMatcherDirection) {
    this.completeMatcherFilterSub.next(filter)
  }

  ensureBatchAgree() {
    this.store.dispatch(new ToBatchAgreeToDoMatchersAction())
  }

  loadMore() {
    this.loadMoreSub.next()
  }

  toInvite(id: string) {
    this.store.dispatch(new ToInviteVisitorToMicroAppAction())
  }

  updateMatcherDetailID(id: string) {
    this.store.dispatch(new UpdateCompleteMatcherDetailIDAction(id))
  }

  toggleLog() {
    this.store.dispatch(new TogglePageStatusAction())
  }

  ensureCreateLog() {
    this.store.dispatch(new ToCreateLoggerAction())
  }

  ensureEditLog(log: Logger) {
    console.log(`visitor to edit log: ${log}`)
  }

  ensureAgreeMatcher(id: string) {
    this.store.dispatch(new ToAgreeToDoMatcherAction(id))
  }

  ensureRefuseMatcher(id: string) {
    this.store.dispatch(new ToRefuseToDoMatcherAction(id))
  }

  ensureSendSMS(phone: string) {
    console.log(`TODO: send sms for visitor!`)
  }

  private initDataSource() {
    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.visitors$ = this.store.select(getVisitors)
    this.currentVisitorsTotal$ = this.store.select(getCurrentVisitorCount)
    this.visitorShouldScrollToTop$ = this.store.select(
      getVisitorShouldScrollToTop
    )
    this.toDoMatcherShouldScrollToTop$ = this.store.select(
      getToDoMatcherShouldScrollToTop
    )
    this.completeMatcherShouldScrollToTop$ = this.store.select(
      getCompleteMatcherShouldScrollToTop
    )

    this.toDoMatchers$ = this.store.select(getToDoMatchers)
    this.completeMatchers$ = this.store.select(getCompleteMatchers)

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
    this.initChangeListStatus()

    const sameWithLast$ = this.listStatusChangeSub
      .pairwise()
      .filter(([prev, curr]) => prev === curr)

    this.initFetchToDoMatcher(sameWithLast$)
    this.initFetchCompleteMatcher(sameWithLast$)
    this.initFetchVisitor(sameWithLast$)
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
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
            statuses: [VisitorMatcherStatus.AGREE],
            direction: VisitorMatcherDirection.ANY
          })
        )
        this.store.dispatch(
          new FetchCompleteMatchersCountAction(VisitorMatcherDirection.ANY)
        )
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
            pageSize: this.pageSize,
            statuses: [VisitorMatcherStatus.AGREE],
            direction: direction
          })
        )

        this.store.dispatch(new FetchCompleteMatchersCountAction(direction))
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
        this.store.dispatch(
          new FetchVisitorsAction({
            ...filter,
            pageIndex: 1,
            pageSize: this.pageSize
          })
        )

        this.store.dispatch(new FetchVisitorsCountAction({ ...filter }))
      })
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
            pageSize: this.pageSize
          })
        )
        this.store.dispatch(new FetchVisitorsCountAction(visitorFilter))
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
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
            statuses: [VisitorMatcherStatus.AGREE],
            direction
          })
        )
        this.store.dispatch(new FetchCompleteMatchersCountAction(direction))
        this.store.dispatch(new ChangePageStatusAction(PageStatus.LIST))
      })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .throttleTime(5e2)
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
    this.store.dispatch(
      new FetchVisitorsAction({
        pageIndex: 1,
        pageSize: this.pageSize
      })
    )
    this.store.dispatch(new FetchVisitorsCountAction())
    this.store.dispatch(new FetchAreaFilterOptionsAction())
    this.store.dispatch(new FetchTypeFilterOptionsAction())
  }
}
