import { Component, ElementRef, ViewChild } from '@angular/core'
import { NavParams, ViewController, ToastController } from 'ionic-angular'

import { Logger, LoggerLevel } from '../models/logger.model'

@Component({
  template: `
  <div class="hz-modal logger-modal">
    <ion-header>
    <ion-toolbar>
      <ion-title>
        编辑日志
      </ion-title>
    </ion-toolbar>
    </ion-header>
    <ion-content>
    <div class="modal-body">
      <div class="modal-panel" [ngClass]="{'primary': level === 'info', 'success': level === 'warn', 'warn': level === 'error'}">
        <div class="logger-level-wrapper">
          <i class="logger-icon logger-icon-primary" [class.active]="level === 'info'" (click)="active('info')"></i>
          <i class="logger-icon logger-icon-success" [class.active]="level === 'warn'" (click)="active('warn')"></i>
          <i class="logger-icon logger-icon-warn" [class.active]="level === 'error'" (click)="active('error')"></i>
        </div>

        <textarea #text rows="5" cols="75" [(ngModel)]="content" placeholder="请输入日志"></textarea>
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
    .logger-modal {
      height: 320px;
    }

    .logger-modal .modal-body {
      padding: 30px 34px;
    }

    .logger-modal .modal-panel {
      min-height: 120px;
      border-right: 1px solid #fff;
      border-bottom: 1px solid #fff;
      border-left: 1px solid #fff;
      border-radius: 10px;
      box-shadow: 0 3px 7px rgba(160, 158, 158, 0.99);
      position: relative;
      padding: 17px 24px;
      background-color: #6190ec;
      -o-transition: all .5s ease;
      transition: all .5s ease;
    }

    .logger-modal .modal-panel textarea {
      resize: none;
      background-color: transparent;
      border: none;
      font-size: 16px;
      color: white;
    }

    .logger-modal .modal-panel textarea::placeholder {
      color: white;
    }

    .logger-modal .modal-panel.primary {
      background-color: #a66cb9
    }

    .logger-modal .modal-panel.success {
      background-color: #0ec5a9;
    }

    .logger-modal .modal-panel.warn {
      background-color: #ef9c64;
    }

    .logger-modal .modal-panel .logger-level-wrapper {
      position: absolute;
      top: -16.5px;
      left: 50%;
      transform: translateX(-50%);
      height: 33px;
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon {
      width: 32px;
      height: 32px;
      border: 3px solid #fff;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0px 2px 4px #2f2e2e;
      margin: 0 11px;
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-primary {
      background-color: #a66cb9;
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-primary.active {
      background-color: transparent;
      background-image: linear-gradient(to bottom, #d68cee, #9852af);
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-success {
      background-color: #0ec5a9;
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-success.active {
      background-color: transparent;
      background-image: linear-gradient(to bottom, #71edda, #0ec5a9);
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-warn {
      background-color: #ef9c64;
    }

    .logger-modal .modal-panel .logger-level-wrapper .logger-icon.logger-icon-warn.active {
      background-color: transparent;
      background-image: linear-gradient(to bottom, #f9cf92, #e99025);
    }
  `]
})
export class ToEditLoggerModal {
  private level: LoggerLevel = 'info'

  private content: string

  private id: string

  private time: string

  @ViewChild('text') el: ElementRef

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
  ) {
    this.level = params.get('level')
    this.content = params.get('content')
    this.id = params.get('id')
    this.time = params.get('time')
  }

  ngAfterViewInit() {
    // this.el.nativeElement.focus()
  }

  private dismiss(data?: Logger): void {
    this.viewCtrl.dismiss(data)
  }

  cancel(): void {
    this.dismiss()
  }

  active(level: LoggerLevel): void {
    this.level = level
  }

  complete(): void {
    if (!this.content) {
      this.toastCtrl.create({
        message: '还没有填写内容呢',
        duration: 3e3,
        position: 'top'
      }).present()
    } else {
      this.dismiss({
        level: this.level,
        content: this.content,
        id: this.id,
        time: this.time
      })
    }
  }
}
