import { Component, OnInit, ElementRef } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { DestroyService } from '../../../providers/destroy.service'
import { SingleSendSmsContext } from '../models/sms.model'

@Component({
  template: `
<div class="hz-modal template-modal">
  <ion-header>
    <ion-toolbar>
      <ion-title>
        创建短信模版
      </ion-title>

    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div class="modal-body">
      <div class="form-layer">
        <div class="form-group">
          <div class="input-group">
            <input type="text" class="form-control" [(ngModel)]="label" placeholder="请输入模版名称">
          </div>
          <ion-item>
            <ion-label>插入关键字</ion-label>
            <ion-select [formControl]="selectedKey" okText="确定" cancelText="取消">
              <ion-option *ngFor="let key of keys" [value]="key">{{key}}</ion-option>
            </ion-select>
          </ion-item>
          <div class="input-group">
            <textarea rows="4" [(ngModel)]="preview" placeholder="请输入模版内容"></textarea>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="hz-btn" (click)="cancel()">取消</button>
      <button type="button" class="hz-btn" (click)="complete()">完成</button>
    </div>
  </ion-content>
</div>
`,
  styles: [
    `
  .template-modal {
    height: 420px;
  }
  .template-modal .modal-body {
    padding: 60px 34px;
  }


`
  ],
  providers: [DestroyService]
})
export class ToCreateTemplateModal implements OnInit {
  label = ''
  preview = ''

  keys = SingleSendSmsContext.TEMPLATE_VARIABLES
  selectedKey: FormControl = new FormControl('')

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private destroyService: DestroyService,
    private el: ElementRef
  ) {}

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  ngOnInit() {
    this.selectedKey.valueChanges
      .takeUntil(this.destroyService)
      .subscribe(key => {
        this.preview += '${' + key + '}'

        const textarea = this.el.nativeElement.querySelector('textarea')
        console.log(textarea)
        if (textarea) {
          setTimeout(() => {
            textarea.focus()
          }, 1000)
        }
      })
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    if (!this.label) {
      this.toastCtrl
        .create({
          message: '还没有填写模版名称呢',
          duration: 3e3,
          position: 'top'
        })
        .present()
    } else {
      this.dismiss({
        label: this.label,
        preview: this.preview
      })
    }
  }
}
