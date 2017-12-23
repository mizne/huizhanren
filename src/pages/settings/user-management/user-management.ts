import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs/Observable'
import { Store } from '@ngrx/store'
import { State, getMaxUserCount, getUsers } from '../reducers/index'
import { getAdminName, getCompanyName, getPhone } from '../../login/reducers/index'
import { FetchAllUserAction, ToDeleteUserAction, ToAddUserAction } from '../actions/user-management.action'
import { User } from '../models/user.model'

@Component({
  selector: 'user-management',
  templateUrl: 'user-management.html'
})
export class UserManagementPage implements OnInit {

  companyName$: Observable<string>
  adminName$: Observable<string>
  phone$: Observable<string>

  users$: Observable<User[]>
  maxCount$: Observable<number>

  constructor(
    private store: Store<State>
  ) {
    this.companyName$ = this.store.select(getCompanyName)
    this.adminName$ = this.store.select(getAdminName)
    this.phone$ = this.store.select(getPhone)

    this.maxCount$ = this.store.select(getMaxUserCount)
    this.users$ = this.store.select(getUsers)
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllUserAction())
  }

  toAddUser() {
    this.store.dispatch(new ToAddUserAction())
  }

  toDeleteUser(id: string) {
    this.store.dispatch(new ToDeleteUserAction(id))
  }
}


@Component({
  selector: 'hz-admin-item',
  template: `
    <div class="admin-item-container">
      <div class="admin-item-title">{{title}}</div>
      <input type="text" [(ngModel)]="_value" disabled>
    </div>
  `,
  styles: [`
    .admin-item-container {
      height: 60px;
    }

    .admin-item-container .admin-item-title {
      margin-bottom: 10px;
      color: #6288d5;
    }

    .admin-item-container input {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      width: 78%;
      padding: 5px;
    }

    .admin-item-container ion-icon {
      color: #666;
    }

    .admin-item-container button {
      width: 60px;
      height: 30px;
      background-color: #fff;
      border: 1px solid #6288d5;
      border-radius: 4px;
      color: #6288d5;
    }
  `]
})
export class HzAdminItemComponent implements OnInit {
  @Input() title: string
  @Input() type: string

  @Input()
  set value(v: string) {
    this._value = v
  }

  _value: string

  constructor() { }

  ngOnInit() {
  }

  clear() {
    this._value = ''
  }
}


@Component({
  selector: 'hz-user-item',
  template: `
    <div class="user-item-container">
      <input class="name-input" type="text" [(ngModel)]="_value" disabled>

      <span class="phone-span">{{phone}}</span>
      <button class="change-btn" (click)="toDelete()">删除</button>
    </div>
  `,
  styles: [`
    :host {
      width: 100%;
    }
    :host:not(:last-child) {
      margin-bottom: 10px;
    }
    .user-item-container {
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10px;
      background-color: #d0ecf9;
    }

    .user-item-container input {
      border: none;
      border-bottom: 1px solid #999;
      width: 20%;
      flex: 4;
      background-color: #d0ecf9;
      padding-left: 10px;
      padding-bottom: 5px;
    }

    .user-item-container ion-icon {
      color: #666;
      flex: 1;
    }

    .user-item-container .phone-span {
      flex: 5;
    }

    .user-item-container button {
      width: 50px;
      height: 30px;
      background-color: #d0ecf9;
      border: 1px solid #6288d5;
      border-radius: 4px;
      color: #6288d5;
      flex: 2;
    }
  `]
})
export class HzUserItemComponent implements OnInit {
  @Input() title: string
  @Input() phone: string

  @Input()
  set name(v: string) {
    this._value = v
  }

  @Output() deleteUser: EventEmitter<void> = new EventEmitter<void>()

  _value: string

  constructor() { }

  ngOnInit() {
  }

  toDelete() {
    this.deleteUser.emit()
  }

  clear() {
    this._value = ''
  }
}

