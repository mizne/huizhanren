import { Component, OnDestroy } from '@angular/core'
import {
  NavParams,
  ViewController
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { ToTabsPageAction } from '../../app/app.action'
import { 
  State, 
  getPhone, 
  getAdminName, 
  getUserName, 
  getCompanyName, 
  getExhibitions 
} from './reducers/index'
import { SelectExhibitionAction } from './actions/exhibitions.action'
import { Exhibition } from './models/exhibition.model'

@Component({
  template: `
<div class="hz-modal welcome-modal">
  <ion-header>
  <ion-toolbar>
    <ion-title>
      欢迎您 {{companyName$ | async}}
    </ion-title>
    
  </ion-toolbar>
  </ion-header>
  <ion-content>
  <div class="modal-body">
    <div class="organize" style="margin-bottom: 30px;">
      <span class="organize-label">管理员：</span>
      <span class="organize-value">{{adminName$ | async}}</span>
    </div>
    <div class="organize" style="margin-bottom: 30px;">
      <span class="organize-label">当前用户：</span>
      <span class="organize-value">{{userName$ | async}}</span>
    </div>
    <div class="organize" style="margin-bottom: 30px;">
      <span class="organize-label">手机号：</span>
      <span class="organize-value">{{phone$ | async}}</span>
    </div>

    <ion-item>
      <ion-label>选择项目</ion-label>
      <ion-select [(ngModel)]="selectedExhibition" okText="确定" cancelText="取消">
        <ion-option *ngFor="let exhibition of (exhibitions$ | async)" [value]="exhibition">{{exhibition.name}}</ion-option>
      </ion-select>
    </ion-item>

    <div class="organize" style="margin-bottom: 30px;">
    <span class="organize-label">使用期限：</span>
    <span class="organize-value">{{selectedExhibition | duration}}</span>
  </div>
  </div>
  <div class="modal-footer">
    <button type="button" class="hz-btn" (click)="enter()">进  入</button>
  </div>
  </ion-content>
</div>
`,
styles: [`
  .welcome-modal {
    height: 450px;
  }
  .welcome-modal button {
    border: none !important;
  }
`]
})
export class WelcomeModal implements OnDestroy {

  selectedExhibition: Exhibition

  phone$: Observable<string>
  adminName$: Observable<string>
  userName$: Observable<string>
  companyName$: Observable<string>
  exhibitions$: Observable<Exhibition[]>

  private subscription: Subscription

  constructor(
    public params: NavParams, 
    public viewCtrl: ViewController, 
    private store: Store<State>
  ) {
    this.phone$ = store.select(getPhone)
    this.adminName$ = store.select(getAdminName)
    this.userName$ = store.select(getUserName)
    this.companyName$ = store.select(getCompanyName)
    this.exhibitions$ = store.select(getExhibitions)

    this.subscription = this.exhibitions$.subscribe((exhibitions) => {
      this.selectedExhibition = exhibitions[0]
    })
  }

  private dismiss(): void {
    this.viewCtrl.dismiss()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  enter(): void {
    this.dismiss()
    this.store.dispatch(new SelectExhibitionAction(this.selectedExhibition.id))
    this.store.dispatch(new ToTabsPageAction())
  }
}
