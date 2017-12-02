import { Component, OnInit, OnDestroy } from '@angular/core'
import {
  NavController,
  ToastController,
  ModalController,
  LoadingController,
  App
} from 'ionic-angular'

// import { Observable } from 'rxjs/Observable'
// import { Subscription } from 'rxjs/Subscription'
// import { Store } from '@ngrx/store'
// import { State, getUpdateText } from './reducers/index'
// import { CheckUpdateAction } from './actions/other.action'
// import { ToLoginPageAction } from '../../app/app.action'
// import { isAdmin, getAdminName, getUserName } from '../login/reducers'

@Component({
  selector: 'page-exhibitors',
  templateUrl: 'exhibitors.html'
})
export class ExhibitorsPage implements OnInit, OnDestroy {
  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private loadCtrl: LoadingController,
    private app: App
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
