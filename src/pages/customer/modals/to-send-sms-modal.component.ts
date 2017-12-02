import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Store } from '@ngrx/store'
import { State } from '../reducers/index'
import { 
  CancelSendSMSAction, 
  EnsureSendSMSAction
 } from '../actions/sms.action'

@Component({
  template: `
<div class="hz-modal to-send-sms-modal">
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
`,
styles: [`
  .modal-wrapper {
    height: 300px;
  }
  .to-send-sms-modal {
    height: 300px;
  }
  .to-send-sms-modal .modal-body {
    display: flex;
    align-items: center;
    font-size: 18px;
  }
`]
})
export class ToSendSMSModal {
  private templateId: string
  private count: string
  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController,
    private store: Store<State>
  ) {
    this.templateId = params.get('templateId')
    this.count = params.get('count')
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
    this.store.dispatch(new CancelSendSMSAction())
  }

  complete() {
    this.dismiss(true)
    this.store.dispatch(new EnsureSendSMSAction(this.templateId))
  }
}
