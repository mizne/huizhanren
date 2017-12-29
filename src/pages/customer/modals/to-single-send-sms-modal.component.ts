import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Store } from '@ngrx/store'
import {
  State,
  getSmsTemplates,
  getShowDetailCustomer
} from '../reducers/index'

import { getBoothNo, getCompanyName } from '../../login/reducers'

import {
  CancelSingleSendSMSAction,
  EnsureSingleSendSMSAction,
  FetchAllTemplateAction
} from '../actions/sms.action'
import { SmsTemplate, SmsTemplateParams } from '../models/sms.model'
import { Customer } from '../models/customer.model'

import { DestroyService } from '../../../providers/destroy.service'

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
    <div class="have-templates" *ngIf="(templates$ | async).length > 0; else noTemplate;">
      <ion-item>
        <ion-label>请选择模板</ion-label>
        <ion-select [formControl]="selectedTemplateCtrl" okText="确定" cancelText="取消">
          <ion-option *ngFor="let template of (templates$ | async)" [value]="template.label">{{template.label}}</ion-option>
        </ion-select>
      </ion-item>
      <textarea rows="4" class="template-content">
        {{templateContent}}
      </textarea>
    </div>

    <ng-template #noTemplate>
      <div class="no-template">还没有短信模板</div>
    </ng-template>
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="cancel()">取消</button>
    <button type="button" class="hz-btn" (click)="complete()">确认</button>
  </div>
  </ion-content>
</div>
`,
  styles: [
    `
  .to-single-send-sms-modal {
    height: 340px;
  }
  .to-single-send-sms-modal .modal-body {
    display: flex;
    align-items: center;
    font-size: 18px;
    flex-direction: column;
  }
  .to-single-send-sms-modal .modal-body .have-templates {
    width: 100%;
  }
  .to-single-send-sms-modal .modal-body .template-content {
    width: 100%;
    padding-left: 8px;
    color: #666;
  }
  .to-single-send-sms-modal .modal-body .no-template {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`
  ],
  providers: [DestroyService]
})
export class ToSingleSendSMSModal implements OnInit {
  private phone: string
  templateContent: string
  templateParams: SmsTemplateParams

  selectedTemplateCtrl: FormControl = new FormControl('')
  selectedTemplateId: string

  templates$: Observable<SmsTemplate[]>

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private store: Store<State>,
    private toastCtrl: ToastController,
    private destroyService: DestroyService
  ) {
    this.phone = params.get('phone')
    this.templates$ = store.select(getSmsTemplates)

    this.templates$
      .withLatestFrom(
        this.store.select(getShowDetailCustomer),
        (templates, customer) => ({
          templates,
          customer
        })
      )
      .withLatestFrom(
        this.store.select(getCompanyName),
        ({ templates, customer }, companyName) => ({
          templates,
          customer,
          companyName
        })
      )
      .withLatestFrom(
        this.store.select(getBoothNo),
        ({ templates, customer, companyName }, boothNo) => ({
          templates,
          customer,
          companyName,
          boothNo
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(({ templates, customer, companyName, boothNo }) => {
        if (templates.length > 0) {
          this.selectedTemplateCtrl.patchValue(templates[0].label, {
            emitEvent: false
          })
          this.selectedTemplateId = templates[0].id
          this.templateContent = this.compluteTemplateContent(
            templates[0],
            customer,
            companyName,
            boothNo
          )
          this.templateParams = this.compluteTemplateParams(
            templates[0],
            customer,
            companyName,
            boothNo
          )
        }

        console.log(templates)
      })

    this.selectedTemplateCtrl.valueChanges
      .withLatestFrom(this.templates$, (label, templates) =>
        templates.find(e => e.label === label)
      )
      .withLatestFrom(
        this.store.select(getShowDetailCustomer),
        (template, customer) => ({
          template,
          customer
        })
      )
      .withLatestFrom(
        this.store.select(getCompanyName),
        ({ template, customer }, companyName) => ({
          template,
          customer,
          companyName
        })
      )
      .withLatestFrom(
        this.store.select(getBoothNo),
        ({ template, customer, companyName }, boothNo) => ({
          template,
          customer,
          companyName,
          boothNo
        })
      )
      .takeUntil(this.destroyService)
      .subscribe(({ template, customer, companyName, boothNo }) => {
        this.selectedTemplateId = template.id
        this.templateContent = this.compluteTemplateContent(
          template,
          customer,
          companyName,
          boothNo
        )
        this.templateParams = this.compluteTemplateParams(
          template,
          customer,
          companyName,
          boothNo
        )
      })
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  private compluteTemplateContent(
    tempalte: SmsTemplate,
    customer: Customer,
    companyName: string,
    boothNo: string
  ): string {
    const templateParams = this.compluteTemplateParams(
      tempalte,
      customer,
      companyName,
      boothNo
    )
    const content = tempalte.preview.replace(/\$\{([^}]+)\}/g, function (m, c) {
      return templateParams[c]
    })
    return content
  }

  private compluteTemplateParams(
    tempalte: SmsTemplate,
    customer: Customer,
    companyName: string,
    boothNo: string
  ): SmsTemplateParams {
    const variableNames = tempalte.preview.match(/\$\{([^}]+)\}/g).map(e =>　e.slice(2, -1))
    let initV: SmsTemplateParams = {}
    const templateParams: SmsTemplateParams = variableNames.reduce((accu, curr) => {
      if (curr === 'exhibitorName') {
        accu.exhibitorName = companyName
      }
      if (curr === 'exhibitorBoothNo') {
        accu.exhibitorBoothNo = boothNo
      }
      if (curr === 'visitorName') {
        accu.visitorName = customer.name
      }
      if (curr === 'visitorTitle') {
        if (customer.jobs.length > 0) {
          accu.visitorTitle = customer.jobs[0].label
        } else {
          accu.visitorTitle = `未知头衔`
        }
      }
      if (curr === 'visitorCompanyName') {
        if (customer.companys.length > 0) {
          accu.visitorCompanyName = customer.companys[0].label
        } else {
          accu.visitorCompanyName = `未知公司`
        }
      }
      return accu
    }, initV)
    return templateParams
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllTemplateAction())
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelSingleSendSMSAction())
  }

  complete() {
    if (!this.selectedTemplateCtrl) {
      this.toastCtrl
        .create({
          message: '还没有选择模板呢',
          duration: 3e3,
          position: 'top'
        })
        .present()
    } else {
      this.dismiss(true)
      this.store.dispatch(
        new EnsureSingleSendSMSAction({
          phone: this.phone,
          content: this.templateParams,
          templateId: this.selectedTemplateId
        })
      )
    }
  }
}
