import { Component, Input, Output, EventEmitter } from '@angular/core'

import { Group } from '../../models/group.model'
import { CustomerPageManageableStatus } from '../../models/customer.model'

@Component({
  selector: 'hz-customer-manage',
  template: `
    <div class="hz-customer-manage">
      <ul class="hz-manage-nav">
        <li class="hz-manage-nav-item" tappable [class.active]="_activeIndex === 0" (click)="tabClick(0)">
          <span>发短信</span>
        </li>

        <li class="hz-manage-nav-item" tappable [class.active]="_activeIndex === 1" (click)="tabClick(1)">
          <span>设置标签</span>
        </li>
      </ul>

      <div class="hz-manage-content">
        <hz-customer-sms-manage class="fade" [class.active]="_activeIndex === 0" [hidden]="_activeIndex !== 0"></hz-customer-sms-manage>
        <hz-customer-group-manage class="fade" [class.active]="_activeIndex === 1" [hidden]="_activeIndex !== 1"></hz-customer-group-manage>
      </div>
    </div>
  `
})
export class HzCustomerManageComponent {
  @Input()
  set active(status: CustomerPageManageableStatus) {
    this._activeIndex = status === CustomerPageManageableStatus.GROUP ? 1 : 0
  }
  _activeIndex: number = 0

  tabClick(index): void {
    this._activeIndex = index
  }
}

@Component({
  selector: 'hz-customer-manage-header',
  template: `
    <div class="hz-customer-manage-header">
      <span>已选择{{ item.number + '个' + item.label }}</span>
      <span *ngIf="type !== GROUP_STATUS" tappable class="select-all" (click)="toggleAll()">全选</span>
    </div>
  `
})
export class HzCustomerManageHeader {
  SMS_STATUS = CustomerPageManageableStatus.SMS
  GROUP_STATUS = CustomerPageManageableStatus.GROUP
  _selectAll: boolean = false

  @Input() item: any
  @Input() type: string

  @Output() selectAll: EventEmitter<boolean> = new EventEmitter<boolean>()

  toggleAll() {
    this._selectAll = !this._selectAll

    this.selectAll.emit(this._selectAll)
  }
}

@Component({
  selector: 'hz-customer-manage-content-item',
  template: `
    <div class="hz-customer-manage-content-item">
      <ng-content></ng-content>
    </div>
  `
})
export class HzCustomerManageContentItem {}

@Component({
  selector: 'hz-customer-manage-template',
  template: `
    <div class="hz-customer-manage-template">
      <div class="left-area">
        <div class="header">
          <span class="label">{{type === GROUP_STATUS ? '选择标签' : '选择模板'}}
            <span class="rename" tappable *ngIf="type === GROUP_STATUS && validSelected" (click)="toRename()">重命名</span>
            <span class="delete" tappable *ngIf="type === GROUP_STATUS && validSelected" (click)="toDel()">删除</span>
          </span>

          <span class="action" tappable (click)="toCreateTemplate(type)">
            <ion-icon name="add-circle" color="primary"></ion-icon>
            <span class="text">{{type === GROUP_STATUS ? '新建标签' : '添加模板'}}</span>
          </span>
        </div>
        <div class="content">
          <div class="template-item" tappable *ngFor="let template of _templates; let i = index;" [class.active]="selectedTemplate === template"
            (click)="selectTemplate(template, i)">{{template.label}}</div>
        </div>
      </div>

      <div class="right-area" *ngIf="type !== GROUP_STATUS">
        <h4>预览</h4>
        <div class="preview">{{selectedTemplate?.preview}}</div>
        <div class="btn-group">
          <button ion-button (click)="toCancelSMS()">取消</button>
          <button ion-button (click)="send()">提交发送</button>
        </div>
      </div>
    </div>

    <div class="hz-btn-wrapper" *ngIf="type === GROUP_STATUS">
      <button ion-button (click)="toCancelGroup()">取消</button>
      <button ion-button (click)="save()">保 存</button>
    </div>
  `
})
export class HzCustomerManageTemplate {
  SMS_STATUS = CustomerPageManageableStatus.SMS
  GROUP_STATUS = CustomerPageManageableStatus.GROUP
  selectedTemplate: any
  _templates: any

  get validSelected(): boolean {
    if (!this.selectedTemplate) {
      return false
    }
    return this.selectedTemplate.id !== Group.NONE.id
  }

  @Input()
  set templates(tmps) {
    this.selectedTemplate = tmps[0]
    this._templates = tmps
  }

  @Input() type: CustomerPageManageableStatus

  @Output() sendSms: EventEmitter<string> = new EventEmitter<string>()
  @Output() cancelSms: EventEmitter<void> = new EventEmitter<void>()
  @Output() cancelGroup: EventEmitter<void> = new EventEmitter<void>()
  @Output() saveTemplate: EventEmitter<string> = new EventEmitter<string>()
  @Output()
  createTemplate: EventEmitter<CustomerPageManageableStatus> = new EventEmitter<
    CustomerPageManageableStatus
  >()
  @Output() renameGroup: EventEmitter<Group> = new EventEmitter<Group>()
  @Output() delGroup: EventEmitter<Group> = new EventEmitter<Group>()

  toCreateTemplate(type: CustomerPageManageableStatus) {
    this.createTemplate.emit(type)
  }

  toRename() {
    this.renameGroup.emit({
      id: this.selectedTemplate.id,
      name: this.selectedTemplate.label
    })
  }

  toDel() {
    this.delGroup.emit({
      id: this.selectedTemplate.id,
      name: this.selectedTemplate.label
    })
  }

  selectTemplate(template, index) {
    this.selectedTemplate = template
  }

  send(): void {
    this.sendSms.emit(this.selectedTemplate.id)
  }

  toCancelSMS(): void {
    this.cancelSms.emit()
  }

  toCancelGroup(): void {
    this.cancelGroup.emit()
  }

  save(): void {
    this.saveTemplate.emit(this.selectedTemplate.id)
  }
}
