import { Component, ViewChild } from '@angular/core'
import {
  LoadingController,
  ToastController,
  NavController,
  Tabs
} from 'ionic-angular'

import { CustomerPage } from '../customer/customer'

import { VisitorPage } from '../visitor/visitor'
import { ExhibitorsPage } from '../exhibitors/exhibitors'
import { MorePage } from '../more/more'

import { Camera, CameraOptions } from '@ionic-native/camera'
import { fakeJson } from '../../fake/fake'
import { environment } from '../../environments/environment'
import { OcrService } from '../../providers/ocr.service'

import { Store } from '@ngrx/store'
import { State } from '../customer/reducers/index'
import { ParseCardSuccessAction } from '../customer/actions/card.action'
import { ToCreateableStatusAction } from '../customer/actions/customer.action'

@Component({
  templateUrl: 'tabs.html',
  styles: [
    `
    .tabbar {
      padding: 0 320px;
    }
    .tab-button {
      min-height: 70px;
    }
  `
  ]
})
export class TabsPage {
  tab1Root = CustomerPage
  tab2Root = VisitorPage
  tab4Root = ExhibitorsPage
  tab5Root = MorePage

  @ViewChild('myTabs') tabRef: Tabs

  options: CameraOptions = {
    quality: 70,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    // targetWidth: 326,
    // targetHeight: 204,
    correctOrientation: true,
    saveToPhotoAlbum: true,
    allowEdit: true
  }

  constructor(
    private camera: Camera,
    private ocrService: OcrService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private store: Store<State>
  ) {}

  takeCamera() {
    this.tabRef.select(0)
    environment.production ? this.takeRealCamera() : this.takeFakeCamera()
  }

  private takeFakeCamera() {
    this.store.dispatch(new ToCreateableStatusAction())
    this.store.dispatch(
      new ParseCardSuccessAction({
        cardImg: fakeJson.base64Img,
        cardInfo: {
          addr: ['南京市雨花区长虹路22号德盈国际广场1栋211号'],
          company: ['江苏超烨科技发展有限公司'],
          department: [],
          email: ['966036112@qq.com'],
          name: '刘亚丽',
          tel_cell: ['13776615796'],
          tel_work: ['02568023353'],
          title: ['营销总监']
        }
      })
    )
  }

  private takeRealCamera(): void {
    this.camera
      .getPicture(this.options)
      .then(imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64:
        let base64Image = 'data:image/png;base64,' + imageData

        let loading = this.loadingCtrl.create({
          content: '解析中...',
          spinner: 'bubbles'
        })

        loading.present()

        this.ocrService.fetchCardInfo(imageData).subscribe(
          data => {
            loading.dismiss()
            try {
              const info = JSON.parse(data.outputs[0].outputValue.dataValue)

              this.store.dispatch(new ToCreateableStatusAction())
              this.store.dispatch(
                new ParseCardSuccessAction({
                  cardImg: base64Image,
                  cardInfo: info
                })
              )
            } catch (e) {
              this.parseCardFailed()
            }
          },
          () => {
            loading.dismiss()
            this.parseCardFailed()
          }
        )
      })
      .catch(() => {
        this.cancelTakeCamera()
      })
  }

  private parseCardFailed() {
    this.toastCtrl
      .create({
        message: '解析名片失败',
        duration: 3e3,
        position: 'top'
      })
      .present()
  }

  private cancelTakeCamera() {
    this.toastCtrl
      .create({
        message: '拍照取消',
        duration: 3e3,
        position: 'top'
      })
      .present()
  }
}
