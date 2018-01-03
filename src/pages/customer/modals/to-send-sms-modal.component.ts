import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  template: `
<div class="hz-modal to-send-sms-modal hz-confirm-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      发送短信
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    确定要给选择的 {{count}} 个号码群发短信吗？
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="cancel()">取消</button>
    <button type="button" class="hz-btn" (click)="complete()">确认</button>
  </div>
  </ion-content>
</div>
`
})
export class ToSendSMSModal {
  // private templateId: string
  count: string
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
    this.count = params.get('count')
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    this.dismiss(true)
  }
}
