import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getSelectedCustomers, getSmsTemplates } from '../../reducers/index'
import {
  PreSendSMSAction,
  SelectPhoneAction,
  CancelSelectPhoneAction,
  FetchAllTemplateAction,
  SelectAllPhoneAction,
  CancelSelectAllPhoneAction
 } from '../../actions/sms.action'
import { ToListableStatusAction } from '../../actions/customer.action'

 import { SmsTemplate } from '../../models/sms.model'

 import { phoneRe } from '../../services/utils'

@Component({
  selector: 'hz-customer-sms-manage',
  template: `
    <div class="hz-customer-sms-manage">
      <hz-customer-manage-header type="sms" [item]="headerItem$ | async" (selectAll)="selectAll($event)"></hz-customer-manage-header>

      <div class="hz-customer-sms-content">
        <hz-customer-manage-content-item *ngFor="let item of (contentItems$ | async)">
          <div class="name">{{item.name}}</div>

          <div class="content" *ngFor="let value of item.items; trackBy: trackByFn">
            <div class="value">
              <span>{{value.value}}</span>
              <ion-checkbox tappable [(ngModel)]="value.selected" (ionChange)="select(value, item)"></ion-checkbox>
            </div>
            <div class="label">{{value.label}}</div>
          </div>
        </hz-customer-manage-content-item>
      </div>

      <hz-customer-manage-template type="sms" [templates]="smsTemplates$ | async"
      (sendSms)="send($event)" (cancelSms)="cancelSms()"></hz-customer-manage-template>
    </div>
  `,
})
export class HzCustomerSmsManageComponent implements OnInit {
  item$: Observable<any>
  contentItems$: Observable<any>
  headerItem$: Observable<any>
  smsTemplates$: Observable<SmsTemplate[]>

  constructor(private store: Store<State>) {
    this.item$ = this.store.select(getSelectedCustomers)
    .map((customers) => {
      return {
        headerLabel: '号码',
        customers: customers.map(e => ({
          id: e.id,
          name: e.name,
          items: e.phones.filter(e => phoneRe.test(e.value))
        }))
      }
    })

    this.contentItems$ = this.item$
    .map(item => item.customers)

    this.headerItem$ = this.item$.map(item => ({
      label: item.headerLabel,
      number: item.customers
      .map(e => e.items.filter(f => f.selected).length)
      .reduce((a, b) => a + b, 0)
    }))

    this.smsTemplates$ = this.store.select(getSmsTemplates)
  }

  trackByFn(_, item) {
    return item.value
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllTemplateAction())
  }

  send(templateId) {
    this.store.dispatch(new PreSendSMSAction(templateId))
  }

  cancelSms() {
    this.store.dispatch(new ToListableStatusAction())
  }

  select(phone, customer) {
    if (phone.selected) {
      this.store.dispatch(new SelectPhoneAction({id: customer.id, phone: phone.value}))
    } else {
      this.store.dispatch(new CancelSelectPhoneAction({id: customer.id, phone: phone.value}))
    }
  }

  selectAll(isSelectAll) {
    if (isSelectAll) {
      this.store.dispatch(new SelectAllPhoneAction())
    } else {
      this.store.dispatch(new CancelSelectAllPhoneAction())
    }
  }

}

