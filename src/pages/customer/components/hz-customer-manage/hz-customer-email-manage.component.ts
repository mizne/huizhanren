import { Component, OnInit } from '@angular/core';
import { CustomerPageManageableStatus } from '../../models/customer.model'

@Component({
  selector: 'hz-customer-email-manage',
  template: `
    <div class="hz-customer-email-manage">
      <hz-customer-manage-header type="email" [item]="headerItem" (selectAll)="selectAll($event)"></hz-customer-manage-header>

      <hz-customer-manage-content-item *ngFor="let item of contentItems">
        <div class="name">{{item.name}}</div>

        <div class="content" *ngFor="let value of item.items">
          <div class="value">
            <span>{{value.value}}</span>
            <ion-checkbox tappable [(ngModel)]="value.selected"></ion-checkbox>
          </div>
          <div class="label">{{value.label}}</div>
        </div>
      </hz-customer-manage-content-item>

      <hz-customer-manage-template [type]="TYPE" [templates]="emailTemplates"></hz-customer-manage-template>
    </div>

  `,
})
export class HzCustomerEmailManageComponent implements OnInit {
  TYPE = CustomerPageManageableStatus.EMAIL
  item = {
    headerLabel: '邮箱地址',
    customers: [
      {
        name: '李玉军',
        items: [
          {
            value: '12345678910@qq.com',
            selected: true,
            label: '邮箱'
          },
          {
            value: '11987654321@gmail.com',
            selected: false,
            label: '邮箱'
          }
        ]
      },
      {
        name: '李玉军1',
        items: [
          {
            value: '12345678910@qq.com',
            selected: false,
            label: '邮箱'
          },
          {
            value: '11987654321@gmail.com',
            selected: true,
            label: '邮箱'
          }
        ]
      },
    ]
  }

  emailTemplates = [
    {
      label: '提醒邮件',
      preview: '李玉军: 感谢您长久以来的支持'
    },
    {
      label: '模板二',
      preview: '这是模板二的预览'
    },
    {
      label: '模板三',
      preview: '这是模板三的预览'
    },
    {
      label: '模板二',
      preview: '这是模板二的预览'
    },
    {
      label: '模板三',
      preview: '这是模板三的预览'
    },
    {
      label: '模板二',
      preview: '这是模板二的预览'
    },
    {
      label: '模板三',
      preview: '这是模板三的预览'
    }
  ]

  get headerItem() {
    return {
      label: this.item.headerLabel,
      number: this.item.customers
      .map(e => e.items.filter(f => f.selected).length)
      .reduce((a, b) => a + b,0)
    }
  }

  get contentItems() {
    return this.item.customers
  }

  constructor() { }

  ngOnInit() { }

  selectAll(flag) {
    this.item.customers.forEach(custom => {
      custom.items.forEach(e => {
        e.selected = flag
      })
    })
  }

}
