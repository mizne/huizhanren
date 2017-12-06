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
  getExhibitors,
  getMatchers,
  getCurrentLogs
} from './reducers/index'
import {
  ToCreateLoggerAction,
  ChangePageStatusAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchExhibitorsAction,
  UpdateDetailIDAction,
  ToInviteExhibitorAction,
  ToShowProcuctAction
} from './actions/exhibitor.action'
import {
  FetchMatchersAction,
  ToAgreeMatcherAction,
  ToCancelMatcherAction,
  ToRefuseMatcherAction,
 } from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Exhibitor,
  Portray,
  ExhibitorFilter,
  RecommendExhibitor,
  Product
} from './models/exhibitor.model'
import { Logger, LoggerLevel } from '../customer/models/logger.model'
import {
  ExhibitorMatcher,
  ExhibitorMatcherStatus
} from './models/matcher.model'
import { AREA_OPTIONS } from '../recommend/models/recommend.model'

import { DestroyService } from '../../providers/destroy.service'
import { FetchRecommendAction } from '../recommend/actions/recommend.action';

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

  listStatusChangeSub: Subject<ListStatus> = new Subject<ListStatus>()
  headerEventSub: Subject<ListHeaderEvent> = new Subject<ListHeaderEvent>()
  recommendFilterSub: Subject<ExhibitorFilter> = new Subject<ExhibitorFilter>()
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
  }

  private initCurrentDetail(): void {
    // 根据list status和 show detail ID寻找当前推荐客户
    const items$: Observable<Exhibitor[]> = this.listStatus$.mergeMap(
      listStatus => {
        if (listStatus === ListStatus.EXHIBITOR) {
          return this.exhibitors$
        } else {
          return this.matchers$
        }
      }
    )

    this.currentDetail$ = this.showDetailID$.withLatestFrom(
      items$,
      (showDetailID, items) => {
        const detail = items.find(e => e.id === showDetailID)
        return detail
      }
    )
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    // this.initRecommendFilter()
    this.initMatcherFilter()
    this.initLoadMore()
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

  // private initRecommendFilter(): void {
  //   this.recommendFilterSub.takeUntil(this.destroyService)
  //   .subscribe((recommendFilter) => {
  //     console.log(recommendFilter)
  //   })
  // }

  private initMatcherFilter(): void {
    this.matcherFilterSub
      .takeUntil(this.destroyService)
      .subscribe(matcherFilter => {
        console.log(matcherFilter)
      })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub
      .asObservable()
      .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreRecommend(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreRecommend(loadMore: Observable<ListStatus>) {
    loadMore
      .filter(e => e === ListStatus.EXHIBITOR)
      .withLatestFrom(
        this.recommendFilterSub.startWith({
          acreage: '',
          area: '',
          key: ''
        }),
        (_, recommendFilter) => recommendFilter
      )
      .takeUntil(this.destroyService)
      .subscribe(recommendFilter => {
        console.log('to load more with recommend filter, ', recommendFilter)
        this.store.dispatch(new FetchRecommendAction())
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
        this.store.dispatch(new FetchMatchersAction())
      })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchExhibitorsAction())
    this.store.dispatch(new FetchMatchersAction())
  }
}
