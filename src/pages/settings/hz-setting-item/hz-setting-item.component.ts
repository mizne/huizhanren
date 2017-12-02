import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'hz-setting-item',
  template: `
    <div class="hz-setting-item">
      <div class="hz-setting-title">
        <span class="hz-title-text">{{hzTitle}}</span>
        <ion-icon *ngIf="hzEditable" class="hz-icon" name="add-circle" (click)="toUserManagement()"></ion-icon>
      </div>
      
      <div class="hz-setting-content" *ngFor="let item of hzItems" (click)="active(item.name)">
        <ion-icon class="hz-icon" [name]="item.icon" [color]="item.active ? 'primary' : 'grey'"></ion-icon>
        <div class="hz-setting-wrapper">
          <span class="hz-setting-label">{{item.label}}</span>
          <span *ngIf="item.value" class="hz-setting-value">{{item.value}}</span>
        </div>
      </div>
    </div>
    
  `
})
export class HzSettingItemComponent implements OnInit {
  @Input() hzTitle: string

  @Input() hzEditable: boolean | undefined

  @Input() hzItems: any[]

  @Output() userManage:EventEmitter<void> = new EventEmitter<void>()

  @Output() smsTemplate:EventEmitter<void> = new EventEmitter<void>()

  @Output() logout: EventEmitter<void> = new EventEmitter<void>()

  @Output() about: EventEmitter<void> = new EventEmitter<void>()

  @Output() checkUpdate: EventEmitter<void> = new EventEmitter<void>()
  
  @Output() tagManagement: EventEmitter<void> = new EventEmitter<void>()
  @Output() download: EventEmitter<void> = new EventEmitter<void>()
  constructor() {}

  ngOnInit() {}

  toUserManagement() {
    this.userManage.emit()
  }

  active(name: string) {
    if (name === 'smsTemplate') {
      this.smsTemplate.emit()
    }

    if (name === 'logout') {
      this.logout.emit()
    }

    if (name === 'about') {
      this.about.emit()
    }

    if (name === 'checkUpdate') {
      this.checkUpdate.emit()
    }

    if (name === 'tagManagement') {
      this.tagManagement.emit()
    }

    if (name === 'download') {
      this.download.emit()
    }
  }
}
