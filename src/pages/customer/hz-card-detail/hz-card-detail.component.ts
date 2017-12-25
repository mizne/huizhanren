import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import {
  State,
  getCustomers,
  getGroups,
  getShowDetailCustomerId,
  getShowDetailGroupId,
  getNotifications
} from '../reducers/index'
import { ToSingleEditGroupAction, ToggleShowNotificationAction } from '../actions/customer.action'
import { ToSingleSendSMSAction } from '../actions/sms.action'
import { Customer } from '../models/customer.model'
import { Notification } from '../models/notification.model'

import { phoneRe } from '../services/utils'

interface Field {
  icon: string
  label: string
  value: string
}

@Component({
  selector: 'hz-card-detail',
  template: `
    <div class="hz-card-detail" [class.close]="!open" [class.open]="open">
      <div class="hz-card-box">
        <div class="hz-img-wrapper">
        <ion-slides zoom="true">
        <ion-slide>
          <div class="swiper-zoom-container">
            <img [src]="(customer$ | async)?.imageUrl">
          </div>
        </ion-slide>
        <ion-slide>
          <div *ngIf="(customer$ | async)?.imageBehindUrl" class="swiper-zoom-container">
            <img [src]="(customer$ | async)?.imageBehindUrl">
          </div>
          <ion-label *ngIf="!(customer$ | async)?.imageBehindUrl">背面未添加</ion-label>
        </ion-slide>
      </ion-slides>
        </div>
      </div>

      <div (clickOutside)="clickOutside()">
        <div class="card-icon-wrapper" tappable (click)="showMore()">
          <ion-icon name="more"></ion-icon>
        </div>
        <div class="hz-popover-wrapper" [@collapseState]="_active?'active':'inactive'">
          <div class="hz-popover-item" tappable (click)="editCustomer.emit(); showMore()">
            <ion-icon name="create"></ion-icon>编辑
          </div>
          <div class="hz-popover-item" tappable (click)="delCustomer.emit(); showMore()">
            <ion-icon name="trash"></ion-icon>删除
          </div>
          <div class="hz-popover-item" tappable (click)="toList.emit(); showMore()">
          <ion-icon name="close-circle"></ion-icon>关闭
        </div>
        </div>
      </div>


      <div class="hz-card-info" [class.close]="!open">
        <div class="hz-person-info">
          <div class="hz-card-name">{{(customer$ | async)?.name}}</div>
          <div class="hz-card-company">{{(customer$ | async).companys[0]?.value}}</div>
        </div>
        <div class="hz-msg-info">
        <div class="hz-msg-tag" tappable (click)="toSingleEditGroup()">
          <ion-icon name="people"></ion-icon>
          标签：{{currentGroupName$ | async}}
        </div>
        <div class="hz-msg-notification" tappable (click)="toShowNotification()">
          <ion-icon name="clock"></ion-icon>
          <span class="hz-msg-content">提醒：{{earliestNotificationContent$ | async}}</span>
        </div>
        <div class="hz-msg-timerest" *ngIf="(notifications$ | async)?.length > 0">{{restTime$ | async | timerest}}</div>
        </div>
      </div>

      <div class="hz-field-container">
        <hz-card-detail-field-item *ngFor="let field of fields$ | async" [field]="field"></hz-card-detail-field-item>
      </div>
    </div>
  `,
  animations   : [
    trigger('collapseState', [
      state('inactive', style({
        display: 'none'
      })),
      state('active', style({
        display: 'block'
      })),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ])
  ]
})
export class HzCardDetailComponent implements OnInit {
  @Input() open: boolean

  private _active: boolean = false

  @Output() editCustomer: EventEmitter<void> = new EventEmitter<void>()

  @Output() delCustomer: EventEmitter<void> = new EventEmitter<void>()

  @Output() showNotification: EventEmitter<void> = new EventEmitter<void>()

  @Output() toList: EventEmitter<void> = new EventEmitter<void>()

  customer$: Observable<Customer>

  currentGroupName$: Observable<string>

  earliestNotificationContent$: Observable<string>

  notifications$: Observable<Notification[]>

  restTime$: Observable<string>

  fields$: Observable<Field[]>

  fields = [
    {
      icon: 'person',
      label: '手机',
      value: '12345678910'
    },
    {
      icon: 'person',
      label: '邮箱',
      value: '12345678910'
    },
    {
      icon: 'person',
      label: '地址',
      value: '12345678910'
    }
  ]

  constructor(private store: Store<State>) {
    this.currentGroupName$ = Observable.combineLatest(
      store.select(getShowDetailGroupId),
      store.select(getGroups)
    )
    .map(([groupId, groups]) => {
      const group = groups.find(e => e.id === groupId)

      return group ? group.name : ''
    })

    this.notifications$ = store.select(getNotifications)

    const earliestNotification$ = store.select(getNotifications)
    .map((notifications: Notification[]) => {
      return notifications[0]
    })

    this.earliestNotificationContent$ = earliestNotification$.map(e => {
      if (e) {
        return e.content
      } else {
        return '还没有提醒'
      }
    })

    this.restTime$ = earliestNotification$.map(e => {
      if (!e) {
        return ''
      }
      if (e) {
        return e.time
      }
    })

    this.customer$ = Observable.combineLatest(
      store.select(getCustomers),
      store.select(getShowDetailCustomerId),
      (customers, id) => customers.find(e => e.id === id)
    )

    this.fields$ = this.customer$.map((customer) => {
      const fields: Field[] = []

      fields.push(...customer.phones.map(p => ({icon: 'phone-portrait', label: p.label, value: p.value})))
      fields.push(...customer.emails.map(p => ({icon: 'mail', label: p.label, value: p.value})))
      fields.push(...customer.addresses.map(p => ({icon: 'locate', label: p.label, value: p.value})))
      fields.push(...customer.departments.map(p => ({icon: 'people', label: p.label, value: p.value})))
      fields.push(...customer.jobs.map(p => ({icon: 'cafe', label: p.label, value: p.value})))
      // fields.push(...customer.company.map(p => ({icon: 'pin', label: p.label, value: p.value})))


      return fields
    })
  }

  clickOutside() {
    this._active = false
  }

  ngOnInit() { }

  showMore() {
    this._active = !this._active
  }

  toSingleEditGroup() {
    this.store.dispatch(new ToSingleEditGroupAction())
  }

  toShowNotification() {
    this.store.dispatch(new ToggleShowNotificationAction(true))
  }

}

@Component({
  selector: 'hz-card-detail-field-item',
  template: `
    <div class="hz-card-detail-field-item">
      <ion-icon [name]="field.icon" color="grey"></ion-icon>
      <div class="hz-content">
        <a [href]="telHref">
          <div class="hz-card-field-value">{{field.value}}</div>
          <div class="hz-card-field-label">{{field.label}}</div>
        </a>
      </div>
      <div class="icon-wrapper" tappable *ngIf="isPhone" (click)="sendSMS()">
        <ion-icon name="chatboxes" color="primary"></ion-icon>
      </div>
    </div>
  `,
  styles: [`
    :host {
      margin: 5px 0;
    }
    .hz-card-detail-field-item {
      display: flex;
      align-items: center;
    }

    .hz-card-detail-field-item ion-icon {
      width: 30px;
      font-size: 20px;
    }

    .hz-card-detail-field-item .hz-content {
      margin-left: 10px;
    }

    .hz-card-detail-field-item .hz-content a {
      text-decoration: none;
      color: #333;
    }

    .hz-card-detail-field-item .hz-content .hz-card-field-value,
    .hz-card-detail-field-item .hz-content .hz-card-field-label {
      margin:2px 0;
    }

    .hz-card-detail-field-item .hz-content .hz-card-field-label {
      color: #AEAEAE;
      font-size: 12px;
    }

    .hz-card-detail-field-item .icon-wrapper {
      margin-left: 20px;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .hz-card-detail-field-item .icon-wrapper .icon {
      font-size: 20px;
    }
  `],
})
export class HzCardDetailFieldItemComponent implements OnInit {

  @Input() field: any

  get isPhone() {
    return phoneRe.test(this.field.value)
  }

  get telHref(): string {
    return phoneRe.test(this.field.value) ? `tel:${this.field.value}` : 'javascript:;'
  }

  constructor(private store: Store<State>) { }

  ngOnInit() {}

  sendSMS() {
    this.store.dispatch(new ToSingleSendSMSAction(this.field.value))
  }
}
