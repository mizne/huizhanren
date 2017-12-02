import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Customer } from '../models/customer.model'

import { Store } from '@ngrx/store'
import { State, getShowDetailCustomerId } from '../reducers'
import { Observable } from 'rxjs/Observable'

import { phoneRe } from '../services/utils'

@Component({
  selector: 'hz-customer-item',
  template: `
    <div class="hz-customer-item" (click)="showDetail(customer.id)" [class.choosed]="hasChoosed$ | async">
      <div class="left-area">
        <ion-checkbox [(ngModel)]="selected" (ionChange)="change($event)"></ion-checkbox>
      </div>
      <div class="center-area">
        <div class="item-name">{{customer.name}}</div>
        <div class="item-company">{{customer.companys[0]?.value}}</div>
      </div>
      <div class="right-area">
        <div class="icon-wrapper" [class.active]="customer.haveSendMsg">
          <ion-icon class="icon" name="chatboxes" [color]="customer.haveSendMsg ? 'primary' : 'grey'"></ion-icon>
        </div>
        <div class="icon-wrapper" [class.active]="customer.haveSendEmail">
          <i class="iconfont icon-yuyue" color="primary"></i>
        </div>
        <div class="icon-wrapper" [class.active]="customer.haveCalled">
          <ion-icon class="icon" name="call" [color]="customer.haveCalled ? 'primary' : 'grey'"></ion-icon>
        </div>
      </div>
    </div>
  `,
})

export class HzCustomerItemComponent implements OnInit {

  @Input() customer: Customer

  @Output() select: EventEmitter<any> = new EventEmitter<any>()
  
  @Output() toShowDetail: EventEmitter<string> = new EventEmitter<string>()

  selected: boolean

  hasChoosed$: Observable<boolean>

  constructor(private store: Store<State>) { 
    this.hasChoosed$ = store.select(getShowDetailCustomerId)
    .map(e => e === this.customer.id)
  }

  ngOnInit() {
    this.selected = this.customer.selected
  }

  change(ev) {
    this.select.emit({
      id: this.customer.id,
      selected: this.selected
    })
  }

  showDetail(id: string) {
    this.toShowDetail.emit(id)
  }

}