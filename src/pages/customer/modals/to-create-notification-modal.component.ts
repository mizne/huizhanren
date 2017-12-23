import { Component, ElementRef, ViewChild } from '@angular/core'
import {
  NavParams,
  ViewController,
  ToastController
} from 'ionic-angular'

import * as fecha from 'fecha'
import { Notification } from '../models/notification.model';

@Component({
  template: `
  <div class="hz-modal notification-modal">
    <ion-header>
    <ion-toolbar>
      <ion-title>
        新建提醒
      </ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content>
    <div class="modal-body">
      <div class="form-layer">
        <div class="form-group">
          <div class="input-group">
            <textarea rows="5" [(ngModel)]="content" placeholder="请输入提醒内容">
            </textarea>
          </div>
          <div class="input-group">
            <ion-item>
              <ion-label>提醒时间</ion-label>
              <ion-datetime displayFormat="YYYY/MM/DD HH:mm"
              pickerFormat="YYYY MM DD HH mm" [(ngModel)]="time"
              cancelText="取消" doneText="确定"
              ></ion-datetime>
            </ion-item>
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
  .notification-modal {
    height: 380px;
  }

  .notification-modal .modal-body {
    padding: 20px 34px;
  }

  .notification-modal .modal-body textarea {
    resize: none;
    padding: 10px 20px;
    width: 100%;
    font-size: 16px;
  }

  .notification-modal .modal-body .input-group:not(:first-child) {
    border: 1px solid #ccc;
    margin-top: 20px;
  }

  .notification-modal .modal-body ion-label {
    color: rgb(117, 117, 117);
  }
`]
})
export class ToCreateNotificationModal {
  private time: string
  private content: string

  private EIGHT_HOURS = 8 * 60 * 60 * 1000
  private DEFAULT_DELAY = 24 * 60 * 60 * 1000
  private DATE_FORMAT = 'YYYY-MM-DD HH:mm'

  @ViewChild('text') el: ElementRef

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
  ) {
    this.time = (new Date(Date.now() + this.EIGHT_HOURS + this.DEFAULT_DELAY)).toISOString()
  }

  ngAfterViewInit() {
    // this.el.nativeElement.focus()
  }

  private dismiss(data?: Notification): void {
    this.viewCtrl.dismiss(data)
  }

  cancel(): void {
    this.dismiss()
  }

  complete() {
    const time = new Date(new Date(this.time).getTime() - this.EIGHT_HOURS)

    if (this.content) {
      this.dismiss({
        time: fecha.format(time, this.DATE_FORMAT),
        content: this.content
      })
    } else {
      this.toastCtrl.create({
        message: '还没有填写内容呢',
        duration: 3e3,
        position: 'top'
      }).present()
    }
  }

}
