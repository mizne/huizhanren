import { Subscription } from 'rxjs/Subscription'
import { Component, ViewChild, OnDestroy, Inject } from '@angular/core'
import { Platform, Nav, ToastController } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
// import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network'

import { Store } from '@ngrx/store'
import { ToLoginPageAction } from './app.action'
import { State, getRootPageState } from '../reducers/index'

import { NativeService } from '../providers/native.service'

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnDestroy {
  rootPage: any

  backButtonPressed: boolean = false

  subscription: Subscription

  @ViewChild('myNav') nav: Nav

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    // private storage: Storage,
    private network: Network,
    private store: Store<State>,
    private nativeService: NativeService,
    private toastCtrl: ToastController,
    @Inject('DEFAULT_PAGE_SIZE') private size
  ) {
    this.platformReady()

    this.rootPage = store.select(getRootPageState)
  }

  platformReady(): void {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault()
      this.splashScreen.hide()

      // this.storage.clear()

      this.store.dispatch(new ToLoginPageAction())

      // 真机
      if (this.nativeService.isIos() || this.nativeService.isAndroid()) {
        this.checkNetwork()
      }
    })
  }

  private checkNetwork() {
    this.subscription = this.network
      .onDisconnect()
      .debounceTime(3e2)
      .subscribe(() => {
        this.toastCtrl
          .create({
            message: '网络未连接，请检查您的网络设置',
            duration: 3e3,
            position: 'top'
          })
          .present()
      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
