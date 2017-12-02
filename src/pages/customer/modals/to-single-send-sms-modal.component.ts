import { Component, OnInit, OnDestroy } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { State, getSmsTemplates } from '../reducers/index'
import { 
  CancelSingleSendSMSAction, 
  EnsureSingleSendSMSAction,
  FetchAllTemplateAction
 } from '../actions/sms.action'
 import { SmsTemplate } from '../models/sms.model'

@Component({
  template: `
<div class="hz-modal to-single-send-sms-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      发送短信
    </ion-title>
    
  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    <div class="select-template">请选择模板</div>
    <div *ngIf="(templates$ | async)?.length > 0" class="show-template-area">
      <div class="template-item" *ngFor="let template of templates$ | async" [class.active]="selectedTemplate === template" 
        (click)="selectTemplate(template)">
        {{template.label}}
      </div>
    </div>
    <div *ngIf="(templates$ | async)?.length === 0">
      还没有短信模板
    </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="cancel()">取消</button>
    <button type="button" class="hz-btn" (click)="complete()">确认</button>
  </div>
  </ion-content>
</div>
`,
styles: [`
  .to-single-send-sms-modal {
    height: 300px;
  }
  .to-single-send-sms-modal .modal-body {
    display: flex;
    align-items: center;
    font-size: 18px;
    flex-direction: column;
  }

  .to-single-send-sms-modal .modal-body .select-template {
    margin: 20px 0;
  }

  .to-single-send-sms-modal .modal-body .show-template-area {
    margin-top: 10px;
    font-size: 16px;
    min-height: 100px;
    overflow: auto;
    display: flex;
    flex-flow: wrap;
  }

  .to-single-send-sms-modal .modal-body .show-template-area .template-item {
    margin-right: 10px;
    margin-top: 5px;
    border: 1px solid #2f5ebd;
    height: 26px;
    line-height: 26px;
    padding-left: 9px;
    padding-right: 9px;
    min-width: 62px;
    cursor: pointer;
    text-align: center;
    color: #6288d5;
    transition: all ease .5s;
  }

  .to-single-send-sms-modal .modal-body .show-template-area .template-item.active {
    color: white;
    background-color: #6288d5;
  }
`]
})
export class ToSingleSendSMSModal implements OnInit, OnDestroy {
  private phone: string
  private selectedTemplate: SmsTemplate

  private subscription: Subscription
  private templates$: Observable<SmsTemplate[]>

  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController,
    private store: Store<State>,
    private toastCtrl: ToastController
  ) {
    this.phone = params.get('phone')
    this.templates$ = store.select(getSmsTemplates)

    this.subscription = this.templates$.subscribe((templates) => {
      this.selectedTemplate = templates[0]
    })
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllTemplateAction())
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

  selectTemplate(template: SmsTemplate) {
    this.selectedTemplate = template
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelSingleSendSMSAction())
  }

  complete() {
    if (!this.selectedTemplate) {
      this.toastCtrl.create({
        message: '还没有选择模板呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.dismiss(true)
      this.store.dispatch(new EnsureSingleSendSMSAction({
        phone: this.phone,
        templateId: this.selectedTemplate.id
      }))
    }
  }
}
