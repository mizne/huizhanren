import { Component } from '@angular/core'
import { IonicPage } from 'ionic-angular'
import { FormControl } from '@angular/forms'

import { Camera, CameraOptions } from '@ionic-native/camera'

import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Store } from '@ngrx/store'

import {
  InitialAction,
  ToDetailableStatusAction,
  ToEditableStatusAction,
  ToListableStatusAction,
  SelectCustomerAction,
  CancelSelectCustomerAction,
  ToggleShowLogAction,
  ToggleShowNotificationAction,
  ToDeleteAction,
  PreCreateAction,
  PreDeleteAction,
  EnsureGroupScrollTopAction
} from './actions/customer.action'
import { TakeBehindImgSuccessAction } from './actions/card.action'
import { ToSendSMSPageAction } from './actions/sms.action'
import {
  ToSetGroupAction,
  ToggleActiveGroupAction,
  ToggleSelectGroupAction
} from './actions/group.action'
import { FetchLoggerAction } from './actions/logger.action'
import { FetchNotificationAction } from './actions/notification.action'
import {
  State,
  getCustomers,
  getCustomerPageStatus,
  getGroups,
  getManageableStatus,
  getShowLog,
  getShowNotification,
  getFields1,
  getFields2,
  getCardImg,
  getCardBehindImg,
  needShowHelpOfToggleLog
} from './reducers/index'
import { CustomerPateStatus } from './reducers/customer.reducer'
import { NestGroup, Group } from './models/group.model'
import { CustomField } from './models/card.model'

import { fakeJson } from '../../fake/fake'
import { environment } from '../../environments/environment'

/**
 * Generated class for the CustomerPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-customer',
  templateUrl: 'customer.html'
})
export class CustomerPage {
  customerCount$: Observable<number>
  nestGroups$: Observable<NestGroup[]>

  status$: Observable<CustomerPateStatus>
  manageableStatus$: Observable<any>
  showLog$: Observable<boolean>
  showNotification$: Observable<boolean>

  searchSubject: Subject<string> = new Subject<string>()
  searchText$: Observable<string> = this.searchSubject
    .asObservable()
    .startWith('')

  cardImg$: Observable<string>
  cardBehindImg$: Observable<string>
  fields1$: Observable<CustomField[]>
  fields2$: Observable<CustomField[]>

  needShowHelpOfToggleLog$: Observable<boolean>

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    cameraDirection: 1,
    targetWidth: 1920,
    targetHeight: 1080
  }

  searchControl: FormControl

  private scrollObj: { scrollTop: number; groupId: string }
  constructor(private store: Store<State>, private camera: Camera) {
    this.customerCount$ = this.store.select(getCustomers).map(e => e.length)
    this.status$ = this.store.select(getCustomerPageStatus)
    this.manageableStatus$ = this.store.select(getManageableStatus)
    this.showLog$ = this.store.select(getShowLog)
    this.showNotification$ = this.store.select(getShowNotification)

    this.fields1$ = this.store.select(getFields1)
    this.fields2$ = this.store.select(getFields2)
    this.cardImg$ = this.store.select(getCardImg)
    this.cardBehindImg$ = this.store.select(getCardBehindImg)

    this.needShowHelpOfToggleLog$ = store.select(needShowHelpOfToggleLog)

    this.searchControl = new FormControl('')
    this.searchText$ = this.searchControl.valueChanges
  }

  ngOnInit() {
    this.initNestGroups()
    this.store.dispatch(new InitialAction())
    this.store.dispatch(new ToListableStatusAction())

    // this.store.dispatch(new ToCreateableStatusAction())
  }

  onSearch(searchText: string) {
    this.searchSubject.next(searchText)
  }

  private initNestGroups() {
    // 将 相应group的customer嵌入group中
    this.nestGroups$ = Observable.combineLatest(
      this.store.select(getGroups),
      this.store.select(getCustomers),
      this.searchControl.valueChanges
      .startWith('')
      .debounceTime(3e2)
      .distinctUntilChanged()
    ).map(([groups, customers, searchText]) => {
      return groups.map(group => {
        let currentGroupCustomers
        if (group.id === Group.NONE.id) {
          currentGroupCustomers = customers.filter(
            customer => customer.groups.length === 0
          )
        } else {
          currentGroupCustomers = customers.filter(
            customer => customer.groups.indexOf(group.id) >= 0
          )
        }

        currentGroupCustomers = currentGroupCustomers
          .filter(customer => this.filterSearchText(customer, searchText))
          .map(customer => ({ ...customer, currentGroup: group.name }))

        return {
          ...group,
          num: currentGroupCustomers.length,
          customers: currentGroupCustomers
        }
      })
    })
  }

  private filterSearchText(customer, searchText) {
    const findCompany = customer.companys.find(
      company => company.value.indexOf(searchText) >= 0
    )
    const findCustomerName = customer.name.indexOf(searchText) >= 0
    const findPhone = customer.phones.find(
      phone => phone.value.indexOf(searchText) >= 0
    )

    return findCompany || findCustomerName || findPhone
  }

  onSelectCustomer(ev) {
    if (ev.selected) {
      this.store.dispatch(new SelectCustomerAction(ev.id))
    } else {
      this.store.dispatch(new CancelSelectCustomerAction(ev.id))
    }

    if (this.scrollObj) {
      this.store.dispatch(new EnsureGroupScrollTopAction(this.scrollObj))
    }
  }

  takeCardBehind() {
    environment.production
      ? this.takeRealCardBehind()
      : this.takeFakeCardBehind()
  }

  private takeRealCardBehind() {
    this.camera.getPicture(this.options).then(imageData => {
      let base64Image = 'data:image/png;base64,' + imageData
      this.store.dispatch(new TakeBehindImgSuccessAction(base64Image))
    })
  }

  private takeFakeCardBehind() {
    let base64Image = fakeJson.base64Img
    this.store.dispatch(new TakeBehindImgSuccessAction(base64Image))
  }

  toSendSms() {
    this.store.dispatch(new ToSendSMSPageAction())
  }

  toSetGroup() {
    this.store.dispatch(new ToSetGroupAction())
  }

  toMultiDelete() {
    this.store.dispatch(new ToDeleteAction(true))
  }

  toEditCustomer() {
    this.store.dispatch(new ToEditableStatusAction())
  }

  toShowNotification() {
    this.store.dispatch(new ToggleShowNotificationAction())
  }

  toList() {
    this.store.dispatch(new ToListableStatusAction())
  }

  toDeleteCustomer() {
    this.store.dispatch(new ToDeleteAction(false))
  }

  toShowDetail(customerId, groupId) {
    this.store.dispatch(new ToDetailableStatusAction({ customerId, groupId }))
    this.store.dispatch(new FetchLoggerAction())
    this.store.dispatch(new FetchNotificationAction())
  }

  onScrollTop(scrollTop, groupId) {
    this.scrollObj = { groupId, scrollTop }
  }

  toggleActiveGroup(groupId: string) {
    this.store.dispatch(new ToggleActiveGroupAction(groupId))
  }

  toggleSelectGroup(groupId: string) {
    this.store.dispatch(new ToggleSelectGroupAction(groupId))
  }

  delCard(): void {
    this.store.dispatch(new PreDeleteAction())
  }

  saveCustomer(): void {
    this.store.dispatch(new PreCreateAction())
  }

  toggleLog(): void {
    this.store.dispatch(new ToggleShowLogAction())
  }
}
