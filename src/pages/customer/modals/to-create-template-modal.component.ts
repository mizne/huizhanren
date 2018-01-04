import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { DestroyService } from '../../../providers/destroy.service'
import { SingleSendSmsContext } from '../models/sms.model'
import { Observable } from 'rxjs/Observable'

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
            <input type="text" class="form-control" [formControl]="labelCtrl" placeholder="请输入模版名称">
          </div>
          <ion-item>
            <ion-label>插入关键字</ion-label>
            <ion-select [formControl]="keyCtrl" placeholder="选择关键字" okText="确定" cancelText="取消">
              <ion-option *ngFor="let key of keys" [value]="key">{{key}}</ion-option>
            </ion-select>
          </ion-item>
          <div class="input-group">
            <textarea rows="4" [formControl]="previewCtrl" placeholder="请输入模版内容"></textarea>
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
    padding: 40px 34px;
  }


`
  ],
  providers: [DestroyService]
})
export class ToCreateTemplateModal implements OnInit {
  private label = ''
  private preview = ''

  keys = SingleSendSmsContext.TEMPLATE_VARIABLES
  keyCtrl: FormControl = new FormControl('')

  labelCtrl: FormControl = new FormControl('')
  previewCtrl: FormControl = new FormControl('')

  MAX_LABEL_LENGTH = 15

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private destroyService: DestroyService
  ) {}

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  ngOnInit() {
    this.initLabel()
    this.initPreview()
  }

  private initLabel() {
    this.labelCtrl.valueChanges
      .do(e => {
        this.label = e.slice(0, this.MAX_LABEL_LENGTH)
      })
      .takeUntil(this.destroyService)
      .subscribe(e => {
        if (e.length > this.MAX_LABEL_LENGTH) {
          this.toastCtrl
            .create({
              message: '模版名称过长',
              duration: 3e3,
              position: 'top'
            })
            .present()

          this.labelCtrl.patchValue(e.slice(0, this.MAX_LABEL_LENGTH), {
            emitEvent: false
          })
        }
      })
  }

  private initPreview() {
    Observable.merge(
      this.previewCtrl.valueChanges,
      this.keyCtrl.valueChanges
        .withLatestFrom(this.previewCtrl.valueChanges.startWith(''))
        .map(([key, preview]) => {
          return preview + '${' + key + '}'
        })
        .do(newPreview => {
          this.previewCtrl.patchValue(newPreview)
        })
    )
      .takeUntil(this.destroyService)
      .subscribe(preview => {
        this.preview = preview
      })
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    if (!this.label) {
      return this.toastCtrl
        .create({
          message: '还没有填写模版名称呢',
          duration: 3e3,
          position: 'top'
        })
        .present()
    }
    if (!this.preview) {
      return this.toastCtrl
        .create({
          message: '还没有填写模版内容呢',
          duration: 3e3,
          position: 'top'
        })
        .present()
    }
    this.dismiss({
      label: this.label,
      preview: this.preview
    })
  }
}
