import { Component } from '@angular/core'
import {
  NavParams,
  ViewController,
} from 'ionic-angular'

@Component({
  template: `
<div class="hz-modal hz-logout-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      退出
    </ion-title>

  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    确定退出此账户?
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
  .hz-logout-modal {
    height: 300px;
  }
  .hz-logout-modal .modal-body {
    display: flex;
    align-items: center;
    font-size: 18px;
  }
`]
})
export class LogoutModal {

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {
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
