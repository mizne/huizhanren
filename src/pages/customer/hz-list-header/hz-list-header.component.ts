import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'hz-list-header',
  template: `
    <div class="hz-list-header">
      <div class="header-label">
        <span class="header-text">客户列表</span>
        <span class="header-count">(共 {{totalCount}} 条)</span>
      </div>
      <div (clickOutside)="clickOutside()">
        <div class="header-icon-wrapper" tappable (click)="showMore()">
          <ion-icon name="more"></ion-icon>
        </div>
        <div class="hz-popover-wrapper" [@collapseState]="_active?'active':'inactive'">
          <div class="hz-popover-item" tappable (click)="sendSms.emit(); showMore()">
            <ion-icon name="chatbubbles"></ion-icon>群发短信
          </div>
          <div class="hz-popover-item" tappable (click)="setGroup.emit(); showMore()">
            <ion-icon name="people"></ion-icon>设置标签
          </div>
          <div class="hz-popover-item" tappable (click)="del.emit(); showMore()">
            <ion-icon name="trash"></ion-icon>删除
          </div>
        </div>
      </div>
    </div>

  `,
  // styleUrls: ['./hz-list-header.scss'],
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

export class HzListHeaderComponent implements OnInit {

  _active: boolean = false

  @Input()
  totalCount: number

  @Output() sendSms: EventEmitter<void> = new EventEmitter<void>()

  @Output() setGroup: EventEmitter<void> = new EventEmitter<void>()

  @Output() del: EventEmitter<void> = new EventEmitter<void>()

  constructor() { }

  ngOnInit() { }

  showMore() {
    this._active = !this._active
  }

  clickOutside() {
    this._active = false
  }
}
