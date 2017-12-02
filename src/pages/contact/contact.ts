import { Component, OnInit, OnChanges } from '@angular/core'
import {
  NavController,
  LoadingController,
  ToastController
} from 'ionic-angular'

import { Camera, CameraOptions } from '@ionic-native/camera'
import { fakeJson } from '../../fake/fake'
import { CustomerPage } from '../customer/customer'
import { OcrService } from '../../providers/ocr.service'

const testImg = fakeJson.base64Img.slice(22)

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  styles: [
    `
    .mz-content {
      background-image: url('./assets/images/camera.jpg') !important;
      background-size: 100% 100%;
    }
  `
  ]
})
export class ContactPage implements OnInit, OnChanges {
  imgSrc: string

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true,
    cameraDirection: 1,
    targetWidth: 1920,
    targetHeight: 1080
  }
  constructor(
    public navCtrl: NavController,
    private camera: Camera,
    private ocrService: OcrService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ionViewDidEnter() {
    // this.fakeTakeCamera()
    // this.takeCamera()

    console.log('contact ion view did enter')
  }

  ngOnInit() {
  }

  ngOnChanges() {}

  private fakeTakeCamera() {
    window.setTimeout(() => {
      this.navCtrl.push(CustomerPage, {
        from: 'camera',
        cardImg: '',
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
    }, 1e3)
  }

  private takeCamera(): void {
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
              this.navCtrl.push(CustomerPage, {
                from: 'camera',
                cardImg: base64Image,
                cardInfo: info
              })
            } catch (e) {
              this.parseCardFailed()
            }
          },
          err => {
            loading.dismiss()
            this.parseCardFailed()
          }
        )
      })
      .catch(e => {
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
    this.navCtrl.push(CustomerPage)
  }

  private cancelTakeCamera() {
    this.toastCtrl
      .create({
        message: '拍照取消',
        duration: 3e3,
        position: 'top'
      })
      .present()
    this.navCtrl.push(CustomerPage)
  }
}
