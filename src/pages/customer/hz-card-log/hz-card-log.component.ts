import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store'
import { State, getLogs, getShowLog, getShowNotification } from '../reducers'
import { ToCreateLoggerAction, ToEditLoggerAction } from '../actions/logger.action'
import { ToggleShowLogAction, ToggleShowNotificationAction } from '../actions/customer.action'
import { Observable } from 'rxjs/Observable'

import { Logger } from '../models/logger.model'

@Component({
  selector: 'hz-card-log',
  template: `
    <div class="hz-card-log" [class.close]="!open">
      <div class="hz-log-title">
        <span class="hz-item" [class.active]="showLog$ | async" (click)="toggleLog()">日志</span>
        <span class="hz-item" [class.active]="showNotification$ | async" (click)="toggleNotification()">提醒</span>
        <span class="hz-item" (click)="toggleAnasisy()">分析</span>
      </div>

      <div class="hz-log-container">
        <hz-card-log-item-add></hz-card-log-item-add>
        <hz-card-log-item *ngFor="let log of logs$ | async" [log]="log"></hz-card-log-item>
        <p class="no-log" *ngIf="(logs$ | async).length === 0">还没有日志呢</p>
      </div>
    </div>
  `,
  styles: [`
  .hz-card-log .hz-log-title {
    width: 100%;
    display: flex;
  }

  .hz-card-log .hz-log-title .hz-item {
    flex: 1;
    text-align: center;
  }

  .hz-card-log .hz-log-title .hz-item.active {
    background-color: #6287d5;
  }
  `]
})
export class HzCardLogComponent implements OnInit {
  @Input()
  open: boolean

  logs$: Observable<Logger[]>

  showLog$: Observable<boolean>
  showNotification$: Observable<boolean>

  constructor(private store: Store<State>) {
    this.logs$ = store.select(getLogs)

    this.showLog$ = store.select(getShowLog)
    this.showNotification$ = store.select(getShowNotification)
  }

  ngOnInit() { }

  toggleLog() {
    this.store.dispatch(new ToggleShowLogAction(true))
  }

  toggleNotification() {
    this.store.dispatch(new ToggleShowNotificationAction(true))
  }

  toggleAnasisy() {

  }

}

@Component({
  selector: 'hz-card-log-item',
  template: `
    <div class="hz-card-log-item">
      <div class="hz-card-log-time">
        {{log.time}}
      </div>
      <div class="hz-card-log-content" [ngClass]="log.level" (click)="editLogger(log)">
        {{log.content}}
      </div>
    </div>
  `,
  styles: [`
    .hz-card-log-item {
      position: relative;
      min-height: 57px;
      padding-bottom: 20px;
      padding-left: 35px;
    }

    .hz-card-log-item:before {
      position: absolute;
      top: 2px;
      left: 3px;
      -webkit-box-sizing: content-box;
      box-sizing: content-box;
      width: 13px;
      height: 13px;
      content: '';
      border-radius: 50%;
      background: #fff;
    }

    .hz-card-log-item:after {
      position: absolute;
      top: 7px;
      left: 9px;
      width: 1px;
      height: 100%;
      content: '';
      background: rgba(245, 247, 252, 0.51);
    }

    .hz-card-log-item .hz-card-log-time {
      margin-bottom: 5px;
      font-size: 12px;
    }

    .hz-card-log-item .hz-card-log-content {
      display: inline-block;
      min-height: 42px;
      padding: 12px 15px 8px;
      border-radius: 4px;
      background: #6190ec;
    }

    .hz-card-log-item .hz-card-log-content.info {
      background-color: #a66cb9;
    }
    .hz-card-log-item .hz-card-log-content.warn {
      background-color: #0ec5a9;
    }
    .hz-card-log-item .hz-card-log-content.error {
      background-color: #ef9c64;
    }
    .hz-card-log-item .hz-card-log-content.sys {
      background-color: #2f5ebd;
    }
  `]
})
export class HzCardLogItemComponent implements OnInit {

  @Input() log: Logger

  constructor(private store: Store<State>) {
  }

  ngOnInit() {
  }

  editLogger(log: Logger) {
    if (log.level !== 'sys') {
      this.store.dispatch(new ToEditLoggerAction(log))
    }
  }
}

@Component({
  selector: 'hz-card-log-item-add',
  template: `
    <div class="hz-card-log-item-add hz-card-log-item">
      添加
      <ion-icon name="add-circle" (click)="createLogger()"></ion-icon>
    </div>
  `,
  styles: [`
    .hz-card-log-item {
      position: relative;
      display: flex;
      min-height: 57px;
      padding-bottom: 20px;
      padding-left: 35px;
    }

    .hz-card-log-item ion-icon {
      font-size: 20px;
      margin-left: 7px;
    }

    .hz-card-log-item:before {
      position: absolute;
      top: 2px;
      left: 3px;
      box-sizing: content-box;
      width: 13px;
      height: 13px;
      content: '';
      border-radius: 50%;
      background: #fff;
    }

    .hz-card-log-item:after {
      position: absolute;
      top: 7px;
      left: 9px;
      width: 1px;
      height: 100%;
      content: '';
      background: rgba(245, 247, 252, 0.51);
    }

    .hz-card-log-item-add:before {
      left: 0;
      width: 13px;
      height: 13px;
      border: 3px solid rgba(108, 140, 220, 0.51);
    }
  `]
})
export class HzCardLogItemAddComponent implements OnInit {

  @Input() log: any

  constructor(
    private store: Store<State>
  ) {

  }

  ngOnInit() {

  }

  createLogger() {
    this.store.dispatch(new ToCreateLoggerAction())
  }
}
