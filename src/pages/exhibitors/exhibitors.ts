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
  getExhibitors,
  getMatchers,
  getCurrentLogs,
  getShowExhibitorLoadMore,
  getShowMatcherLoadMore
} from './reducers/index'
import {
  ToCreateLoggerAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchExhibitorsAction,
  UpdateDetailIDAction,
  ToInviteExhibitorAction,
  ToShowProcuctAction,
  FetchLoggerAction,
  FetchExhibitorsCountAction,
  LoadMoreExhibitorsAction
} from './actions/exhibitor.action'
import {
  FetchMatchersAction,
  ToAgreeMatcherAction,
  ToCancelMatcherAction,
  ToRefuseMatcherAction,
  FetchMatchersCountAction,
  LoadMoreMatchersAction
} from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Exhibitor,
  Portray,
  ExhibitorFilter,
  RecommendExhibitor,
  Product,
  FetchRecommendExhibitorParams
} from './models/exhibitor.model'
import { Logger } from '../customer/models/logger.model'
import {
  ExhibitorMatcher,
  ExhibitorMatcherStatus
} from './models/matcher.model'
import { AREA_OPTIONS } from '../visitor/models/visitor.model'

import { DestroyService } from '../../providers/destroy.service'

@IonicPage()
@Component({
  selector: 'page-exhibitors',
  templateUrl: 'exhibitors.html',
  providers: [DestroyService]
})
export class ExhibitorsPage implements OnInit, OnDestroy {
  exhibitors$: Observable<RecommendExhibitor[]>
  matchers$: Observable<ExhibitorMatcher[]>

  pageStatus$: Observable<PageStatus>
  listStatus$: Observable<ListStatus>
  showDetailID$: Observable<string>
  currentDetail$: Observable<Exhibitor>
  currentLogs$: Observable<Logger[]>
  currentPortray$: Observable<Portray>
  showLoadMore$: Observable<boolean>

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  exhibitorFilterSub: Subject<ExhibitorFilter> = new Subject<ExhibitorFilter>()
  matcherFilterSub: Subject<ExhibitorMatcherStatus[]> = new Subject<
    ExhibitorMatcherStatus[]
  >()
  loadMoreSub: Subject<void> = new Subject<void>()

  filterOptions = [
    AREA_OPTIONS,
    [
      {
        label: '不限面积',
        value: ''
      },
      {
        label: '9-18m2',
        value: '0'
      },
      {
        label: '18-27m2',
        value: '1'
      },
      {
        label: '27-54m2',
        value: '2'
      },
      {
        label: '>54m2',
        value: '3'
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
    this.store.dispatch(new ToInviteExhibitorAction())
  }

  ensureCreateLogger() {
    this.store.dispatch(new ToCreateLoggerAction())
  }

  ensureShowProduct(product: Product) {
    this.store.dispatch(new ToShowProcuctAction(product))
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
    this.exhibitors$ = this.store.select(getExhibitors)
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

    this.currentLogs$ = this.store.select(getCurrentLogs)
    this.showLoadMore$ = Observable.merge(
      this.listStatus$
        .filter(e => e === ListStatus.EXHIBITOR)
        .mergeMap(() => this.store.select(getShowExhibitorLoadMore)),
      this.listStatus$
        .filter(e => e === ListStatus.MATCHER)
        .mergeMap(() => this.store.select(getShowMatcherLoadMore))
    )
  }

  private initCurrentDetail(): void {
    // 根据list status和 show detail ID寻找当前推荐客户
    const latestItems$: Observable<Exhibitor[]> = Observable.combineLatest(
      Observable.merge(
        this.exhibitors$.withLatestFrom(
          this.matchers$,
          (exhibitors, matchers) => [exhibitors, matchers]
        ),
        this.matchers$.withLatestFrom(
          this.exhibitors$,
          (matchers, exhibitors) => [exhibitors, matchers]
        )
      ),
      this.listStatus$,
      ([exhibitors, matchers], listStatus) => {
        if (listStatus === ListStatus.EXHIBITOR) {
          return exhibitors
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
          acreage: '',
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
                console.log(`to refresh exhibitor data`)
                this.store.dispatch(new FetchExhibitorsAction(exhibitorFilter))
              }
              if (listStatus === ListStatus.MATCHER) {
                console.log(`to refresh exhibitor matcher data`)
                console.log(matcherFilter)
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

  private initExhibitorFilter(): void {
    this.exhibitorFilterSub
      .distinctUntilChanged((prev, curr) => {
        return (
          prev.area === curr.area &&
          prev.acreage === curr.acreage &&
          prev.key === curr.key
        )
      })
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log(recommendFilter)

        const params: FetchRecommendExhibitorParams = {
          ...recommendFilter,
          pageIndex: 1,
          pageSize: 10
        }
        this.store.dispatch(new FetchExhibitorsAction(params))
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

    this.initLoadMoreExhibitor(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreExhibitor(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.EXHIBITOR)
      .withLatestFrom(
        this.exhibitorFilterSub.startWith({
          acreage: '',
          area: '',
          key: ''
        }),
        (_, recommendFilter) => recommendFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log('to load more with exhibitor filter, ', recommendFilter)
        this.store.dispatch(new LoadMoreExhibitorsAction(recommendFilter))
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
    this.showDetailID$.takeUntil(this.destroyService).subscribe(exhibitorId => {
      if (exhibitorId) {
        this.store.dispatch(new FetchLoggerAction(exhibitorId))
      }
    })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchExhibitorsAction())
    this.store.dispatch(new FetchMatchersAction())

    this.store.dispatch(new FetchExhibitorsCountAction())
    this.store.dispatch(new FetchMatchersCountAction())
  }
}
