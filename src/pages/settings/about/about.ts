import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hz-about',
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>关 于</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content>

    <div class="hz-about-container">
      <div class="hz-about-version">
        I-RDESK 2.0.20170601
      </div>
      <div class="hz-about-copyright">
        @2017 huizhanren.com All Rights Reserved.
      </div>
    </div>
  </ion-content>
  `,
  styles: [`
    .hz-about-container {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .hz-about-container .hz-about-version {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .hz-about-container .hz-about-copyright {
      font-size: 16px;
      color: #999;
    }
  `]
})

export class HzAboutPage implements OnInit {
  constructor() { }

  ngOnInit() { }
}