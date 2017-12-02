import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

@Component({
  template: `
<div class="hz-modal group-modal">
  <ion-header>
    <ion-toolbar>
      <ion-title>
        创建标签
      </ion-title>
      
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <div class="modal-body">
      <div class="form-layer">
        <div class="form-group">
          <div class="input-group">
            <input type="text" class="form-control" [(ngModel)]="groupName" placeholder="标签名称" />
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
styles: [`
  .group-modal {
    height: 320px;
  }

  .group-modal .modal-body {
    padding: 60px 34px;
  }

`]
})
export class CreateGroupModal {
  private groupName: string

  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController,
    private toastCtrl: ToastController
  ) {
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }

  cancel() {
    this.dismiss()
  }

  complete() {
    if (!this.groupName) {
      this.toastCtrl.create({
        message: '还没有填写标签名称呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.dismiss(this.groupName)
    }
  }
}
