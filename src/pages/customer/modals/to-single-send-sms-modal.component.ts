import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Store } from '@ngrx/store'
import {
  State,
  getSmsTemplates,
} from '../reducers/index'
import {
  CancelSingleSendSMSAction,
  EnsureSingleSendSMSAction,
  FetchAllTemplateAction
} from '../actions/sms.action'
import { SmsTemplate, SmsTemplateParams } from '../models/sms.model'
import { DestroyService } from '../../../providers/destroy.service'
import { TenantService } from '../../../providers/tenant.service'

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
    private destroyService: DestroyService,
    private tenantService: TenantService
  ) {
    this.phone = params.get('phone')
    this.templates$ = store.select(getSmsTemplates)

    Observable.merge(
      this.templates$
        .filter(templates => templates.length > 0)
        .do(templates => {
          this.selectedTemplateCtrl.patchValue(templates[0].label, {
            emitEvent: false
          })
        })
        .map(templates => templates[0]),

      this.selectedTemplateCtrl.valueChanges.withLatestFrom(
        this.templates$,
        (label, templates) => templates.find(e => e.label === label)
      )
    )
      .withLatestFrom(this.tenantService.getSendSmsContext())
      .takeUntil(this.destroyService)
      .subscribe(([template, sendSmsContext]) => {
        this.selectedTemplateId = template.id
        const { params, content } = sendSmsContext.computeTemplate(template.preview)
        this.templateContent = content
        this.templateParams = params
      })
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
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
