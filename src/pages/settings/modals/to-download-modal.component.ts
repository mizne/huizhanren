import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  template: `
<div class="hz-modal hz-add-user-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      数据导出
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    请移步i-rdesk官网下载（www.i-rdesk.com）
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="ensure()">确定</button>
  </div>
  </ion-content>
</div>
`,
styles: [`
  .hz-add-user-modal {
    height: 400px;
  }
  .hz-add-user-modal .modal-body {
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hz-add-user-modal .modal-body .input-group {
    margin-bottom: 20px;
    margin-top: 10px;
  }
`]
})
export class ToDownloadModal {
  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  ensure() {
    this.dismiss()
  }
}
