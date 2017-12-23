import { Component, OnInit, Input } from '@angular/core';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { State, getSmsTemplates } from '../../customer/reducers/index'
import { FetchAllTemplateAction } from '../../customer/actions/sms.action'

import { SmsTemplate } from '../../customer/models/sms.model'

@Component({
  selector: 'sms-template',
  templateUrl: 'sms-template.html'
})
export class SmsTemplatePage implements OnInit {

  smsTemplates$: Observable<SmsTemplate[]>

  selectedTemplate: SmsTemplate

  private subscription: Subscription

  constructor(private store: Store<State>) {
    this.smsTemplates$ = store.select(getSmsTemplates)
    this.subscription = this.smsTemplates$.subscribe((tmps) => {
      this.selectedTemplate = tmps[0]
    })
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllTemplateAction())
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  select(template: SmsTemplate) {
    this.selectedTemplate = template
  }
}


@Component({
  selector: 'hz-sms-template-detail',
  template: `
  <div class="hz-sms-template-detail-container">
    <div class="hz-template-name">
      <div class="hz-template-title">
        模板名称
      </div>
      <div class="hz-name-content">
        <input type="text" [(ngModel)]="_name" disabled>
        <ion-icon name="close"></ion-icon>
      </div>
    </div>

    <div class="hz-template-preview">
      <div class="hz-template-title">
        模板内容
      </div>
      <div class="hz-name-content">
        <textarea rows="5" cols="75" [(ngModel)]="_preview" disabled></textarea>
      </div>
    </div>

    <div class="hz-template-prompt">
      1、不支持营销短信、全变量短信模板。例如：您好，$(msg)<br>
      2、变量格式如$(name),不能使用$(email),$(mobile),$(id),$(nick),$(site)<br>
      3、请勿在变量中添加特殊符号，如：,.#/:。<br>
      4、如有链接，请将链接地址写入模板内容中，便于核实<br>
      5、模板内容无需添加签名，内容首尾不能添加[],【】符号，调用接口时传入签名即可<br>
      6、短信字数&lt;=70个字数，按照70个字数一条短信计算<br>
      7、短信字数&gt;70个字数，即为长短信，按照67个字数为一条短信计算<br>
    </div>
  </div>
  `,
  styles: [`
    .hz-sms-template-detail-container {

    }

    .hz-sms-template-detail-container .hz-template-name {
      height: 60px;
      margin-bottom: 20px;
    }

    .hz-sms-template-detail-container .hz-template-name .hz-template-title,
    .hz-sms-template-detail-container .hz-template-preview .hz-template-title {
      margin-bottom: 10px;
      color: #6288d5;
    }

    .hz-sms-template-detail-container .hz-template-name input {
      border: none;
      border-bottom: 1px solid #ddd;
      width: 90%;
      color: #333;
      padding: 6px;
    }

    .hz-sms-template-detail-container .hz-template-name ion-icon {
      color: #ddd;
    }

    .hz-sms-template-detail-container .hz-template-preview textarea {
      boder: 1px solid #ccc;
      resize: none;
      width: 90%;
      padding: 6px;
    }

    .hz-sms-template-detail-container .hz-template-prompt {
      font-size: 12px;
      color: #b2b2b2;
      margin-top: 12px;
    }
  `]
})
export class SmsTemplateDetailComponent implements OnInit {
  @Input()
  set label(s: string) {
    this._name = s
  }

  @Input()
  set preview(p: string) {
    this._preview = p
  }

  _name: string

  _preview: string

  constructor() {}

  ngOnInit() {}
}


