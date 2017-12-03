import { Component, OnInit, OnDestroy } from '@angular/core'
import {
  NavController,
  ToastController,
  ModalController,
  LoadingController,
  App
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
  getMatchers
} from './reducers/index'
import {
  ToCreateLoggerAction,
  ChangePageStatusAction,
  TogglePageStatusAction,
  ChangeListStatusAction,
  FetchRecommendAction,
  UpdateDetailIDAction,
} from './actions/recommend.action'
import { FetchMatchersAction } from './actions/matcher.action'

import {
  PageStatus,
  ListStatus,
  ListHeaderEvent,
  Recommend,
  Portray
} from './models/recommend.model'
import { DestroyService } from '../../providers/destroy.service'

import { Logger, LoggerLevel } from '../customer/models/logger.model'
import { Customer } from './models/recommend.model'
import { Matcher, MatcherStatus } from './models/matcher.model'

export interface RecommendFilter {
  area: string,
  type: string,
  key: string
}

@Component({
  selector: 'page-recommend',
  templateUrl: 'recommend.html',
  providers: [DestroyService]
})
export class RecommendPage implements OnInit, OnDestroy {
  recommends = [
    {
      name: 'testName1',
      title: 'testTitle1',
      company: 'testCompany1',
      industry: 'testIndustry1',
      area: 'testArea1'
    },
    {
      name: 'testName2',
      title: 'testTitle2',
      company: 'testCompany2',
      industry: 'testIndustry2',
      area: 'testArea2'
    },
    {
      name: 'testName3',
      title: 'testTitle3',
      company: 'testCompany3',
      industry: 'testIndustry3',
      area: 'testArea3'
    }
  ]

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

  private initDataSource() {
    this.pageStatus$ = this.store.select(getPageStatus)
    this.listStatus$ = this.store.select(getListStatus)
    this.recommends$ = this.store.select(getRecommends)
    this.matchers$ = this.store.select(getMatchers)

    this.showDetailID$ = this.store.select(getShowDetailID)
    this.initCurrentDetail()

    this.currentLogs$ = Observable.of([
      {
        id: '0',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '1',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      },
      {
        id: '2',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '3',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      },
      {
        id: '4',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '5',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      },
      {
        id: '0',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '1',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      },
      {
        id: '2',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '3',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      },
      {
        id: '4',
        time: '2017-12-11',
        content: 'test Logger1',
        level: 'sys' as LoggerLevel
      },
      {
        id: '5',
        time: '2017-12-14',
        content: 'test Logger2',
        level: 'info' as LoggerLevel
      }
    ])
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
        return items.find(e => e.id === showDetailID)
      }
    )
  }

  private initSubscriber() {
    this.initListHeaderChange()
    this.initListHeaderEvent()

    this.initRecommendFilter()
    this.initMatcherFilter()
    this.initLoadMore()
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
      })
  }

  private initRecommendFilter(): void {
    this.recommendFilterSub.takeUntil(this.destroyService)
    .subscribe((recommendFilter) => {
      console.log(recommendFilter)
    })
  }

  private initMatcherFilter(): void {
    this.matcherFilterSub.takeUntil(this.destroyService)
    .subscribe((matcherFilter) => {
      console.log(matcherFilter)
    })
  }

  private initLoadMore(): void {
    const loadMore$ = this.loadMoreSub.asObservable()
    .withLatestFrom(this.listStatus$, (_, listStatus) => listStatus)

    this.initLoadMoreRecommend(loadMore$)
    this.initLoadMoreMatcher(loadMore$)
  }

  private initLoadMoreRecommend(loadMore: Observable<ListStatus>) {
    loadMore.filter(e => e === ListStatus.RECOMMEND)
    .withLatestFrom(this.recommendFilterSub.startWith({
      type: '',
      area: '',
      key: ''
    }), (_, recommendFilter) => recommendFilter)
    .takeUntil(this.destroyService)
    .subscribe((recommendFilter) => {
      console.log('to load more with recommend filter, ', recommendFilter)
    })
  }

  private initLoadMoreMatcher(loadMore: Observable<ListStatus>) {
    loadMore.filter(e => e === ListStatus.MATCHER)
    .withLatestFrom(this.matcherFilterSub, (_, matcherFilter) => matcherFilter)
    .takeUntil(this.destroyService)
    .subscribe((matcherFilter) => {
      console.log('to load more with matcher filter, ', matcherFilter)
    })
  }

  private initDispatch(): void {
    this.store.dispatch(new FetchRecommendAction())
    this.store.dispatch(new FetchMatchersAction())
  }
}
