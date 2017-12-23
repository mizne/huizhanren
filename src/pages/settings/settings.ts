import { Component, OnInit, OnDestroy } from '@angular/core'
import {
  NavController,
  ToastController,
  ModalController,
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { Store } from '@ngrx/store'
import { State, getUpdateText } from './reducers/index'
import { CheckUpdateAction } from './actions/other.action'
import { ToLoginPageAction } from '../../app/app.action'
import { isAdmin, getAdminName, getUserName } from '../login/reducers'

import { UserManagementPage } from './user-management/user-management'
import { SmsTemplatePage } from './sms-template/sms-template'

import { LogoutModal } from './modals/logout-modal.component'
import { HzAboutPage } from './about/about'

import { ToDownloadModal } from './modals/to-download-modal.component'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit, OnDestroy {
  isAdmin$: Observable<boolean>

  private subscription1: Subscription
  private subscription2: Subscription
  private subscription3: Subscription

  items1 = [
    {
      title: '帐号设置',
      items: [
        {
          icon: 'chatbubbles',
          active: false,
          label: '短信帐号',
          name: 'tagManagement',
          value: ''
        }
      ]
    },
    {
      title: '模板设置',
      items: [
        {
          icon: 'paper',
          active: true,
          label: '短信模板',
          name: 'smsTemplate',
          value: ''
        }
      ]
    }
  ]

  items2 = [
    {
      title: '互动设置',
      items: [
        {
          icon: 'help-buoy',
          active: false,
          label: '大转盘',
          name: 'bigTurntable',
          value: ''
        },
        {
          icon: 'card',
          active: false,
          label: '刮刮卡',
          name: 'scratchCard',
          value: ''
        }
      ]
    },
    {
      title: '用户管理',
      editable: true,
      items: [
        {
          icon: 'contact',
          active: false,
          label: '管理员',
          name: 'manager',
          value: ''
        },
        {
          icon: 'contacts',
          active: false,
          label: '用户',
          name: 'user',
          value: ''
        }
      ]
    }
  ]

  items3 = [
    {
      title: '设置',
      items: [
        {
          icon: 'cloud-download',
          active: true,
          label: '数据导出',
          name: 'download',
          value: ''
        },
        {
          icon: 'wifi',
          active: false,
          label: '网络名称',
          name: 'netName',
          value: ''
        },
        {
          icon: 'eye-off',
          active: false,
          label: '网络密码',
          name: 'netPassword',
          value: ''
        }
      ]
    },
    {
      title: '其他',
      items: [
        {
          icon: 'sync',
          active: true,
          label: '检查更新',
          name: 'checkUpdate',
          value: ''
        },
        {
          icon: 'information-circle',
          active: true,
          label: '关于',
          name: 'about',
          value: ''
        },
        {
          icon: 'log-out',
          active: true,
          label: '退出当前账户',
          name: 'logout',
          value: ''
        }
      ]
    }
  ]

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private store: Store<State>
  ) {}

  ngOnInit() {
    this.isAdmin$ = this.store.select(isAdmin)

    this.subscription1 = Observable.combineLatest(
      this.store.select(getAdminName),
      this.store.select(getUserName)
    ).subscribe(([adminName, userName]) => {
      this.items2[1].items[0].value = adminName
      this.items2[1].items[1].value = userName
    })

    this.subscription2 = this.store
      .select(getUpdateText)
      .subscribe(updateText => {
        this.items3[1].items[0].value = updateText
      })
  }

  ngOnDestroy() {
    this.subscription1.unsubscribe()
    this.subscription2.unsubscribe()
    this.subscription3 && this.subscription3.unsubscribe()
  }

  toSmsTemplate() {
    this.navCtrl.push(SmsTemplatePage)
  }

  toTagManagement() {}

  toUserManage() {
    this.subscription3 = this.isAdmin$.subscribe(isAdmin => {
      if (isAdmin) {
        this.navCtrl.push(UserManagementPage)
      } else {
        this.toastCtrl
          .create({
            message: '您还不是管理员',
            duration: 3e3,
            position: 'top'
          })
          .present()
      }
    })
  }

  toLogout() {
    const logoutModal = this.modalCtrl.create(LogoutModal)

    logoutModal.onDidDismiss(ensure => {
      if (ensure) {
        this.store.dispatch(new ToLoginPageAction())
      }
    })

    logoutModal.present()
  }

  toAbout() {
    this.navCtrl.push(HzAboutPage)
  }

  toDownload() {
    this.modalCtrl.create(ToDownloadModal).present()
  }

  checkUpdate() {
    this.store.dispatch(new CheckUpdateAction())
  }
}
