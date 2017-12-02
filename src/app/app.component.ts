import { Subscription } from 'rxjs/Subscription'
import { Component, ViewChild, OnDestroy } from '@angular/core'
import { Platform, Nav, ToastController, IonicApp } from 'ionic-angular'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { Storage } from '@ionic/storage'
import { Network } from '@ionic-native/network'

import { Store } from '@ngrx/store'
import { ToLoginPageAction, ToTabsPageAction } from './app.action'
import { State, getRootPageState } from '../reducers/index'

import { NativeService } from '../providers/native.service'

@Component({
  templateUrl: 'app.html'
  // styleUrls: ['./app.scss']
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
    private storage: Storage,
    private network: Network,
    private store: Store<State>,
    private nativeService: NativeService,
    private ionicApp: IonicApp,
    private toastCtrl: ToastController
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

      this.storage.get('HAS_LOGIN').then(hasLogin => {
        // if (hasLogin) {
        //   this.store.dispatch(new ToTabsPageAction())
        // } else {
        this.store.dispatch(new ToLoginPageAction())
        // }
      })


      // 真机
      if (this.nativeService.isIos() || this.nativeService.isAndroid()) {
        // this.registerBackButtonAction()

        this.checkNetwork()
      }
    })
  }

  private checkNetwork() {
    this.subscription = this.network.onDisconnect().debounceTime(3e2).subscribe(() => {
      this.toastCtrl
        .create({
          message: '网络未连接',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })
  }

  /**
 * 返回按钮事件
 */
  private registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {
      let activePortal = this.ionicApp._modalPortal.getActive()
      if (activePortal) {
        activePortal.dismiss().catch(() => {})
        activePortal.onDidDismiss(() => {})
        return
      }
      let activeVC = this.nav.getActive()
      let tabs = activeVC.instance.tabs
      let activeNav = tabs.getSelected()
      return activeNav.canGoBack() ? activeNav.pop() : this.showExit()
    }, 1)
  }
  /**
* 双击退出提示框
*/
  private showExit() {
    //当触发标志为true时，即2秒内双击返回按键则最小化APP
    if (this.backButtonPressed) {
      //this.appMinimize.minimize();
      this.platform.exitApp()
    } else {
      this.toastCtrl
        .create({
          message: '再按一次退出应用',
          duration: 2000,
          position: 'top'
        })
        .present()
      this.backButtonPressed = true
      // 2秒内没有再次点击返回则将触发标志标记为false
      setTimeout(() => (this.backButtonPressed = false), 2000)
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
