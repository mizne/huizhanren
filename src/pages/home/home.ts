import { Component, OnInit, OnDestroy } from '@angular/core'
import { NavController, NavParams } from 'ionic-angular'
import { FormGroup, FormBuilder } from '@angular/forms'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [
    `
  .mz-content {
    background-image: url('./assets/images/account.png') !important;
    background-size: 100% 100%;
  }
  .mz-content.camera {
    background-image: url('./assets/images/home-camera.png') !important;
    background-size: 100% 100%;
  }
  .card-image {
    background-image: url('./assets/images/background.png');
  }
  `
  ]
})
export class HomePage implements OnInit, OnDestroy {
  myForm: FormGroup
  abstractForm: FormGroup
  fromCamera: boolean = false
  cardImg: string
  cardInfo: any = null

  // cardInfo: any = {
  //   addr: ['南京市雨花区长虹路22号德盈国际广场1栋211号'],
  //   company: ['江苏超烨科技发展有限公司'],
  //   department: ['营销总部'],
  //   email: ['966036112@qq.com'],
  //   name: '刘亚丽',
  //   tel_cell: ['13776615796'],
  //   tel_work: ['02568023353'],
  //   title: ['营销总监']
  // }

  constructor(
    public navCtrl: NavController,
    private navParams: NavParams,
    private formBuilder: FormBuilder,
  ) {
  }

  ionViewDidEnter() {
    if (this.navParams.data.from === 'camera') {
      this.cardImg = this.navParams.data.cardImg
      this.cardInfo = this.navParams.data.cardInfo

      this.fromCamera = true
      this.buildForm()
      this.initForm()
    }
  }

  ngOnInit() {
    this.buildForm()
  }

  ngOnDestroy() {
  }

  save() {}

  /**
   * 构造 表单模型
   *
   * @memberof LoginPage
   */
  private buildForm(): void {
    this.myForm = this.formBuilder.group({
      mobile: [''],
      tel: [''],
      address: [''],
      email: [''],
      other: [''],
      company: ['']
    })

    this.abstractForm = this.formBuilder.group({
      name: [''],
      title: [''],
      company: [''],
      group: [''],
      notify: ['']
    })
  }

  private initForm(): void {
    this.myForm.patchValue({
      mobile: this.cardInfo.tel_cell[0],
      tel: this.cardInfo.tel_work[0],
      address: this.cardInfo.addr[0],
      email: this.cardInfo.email[0],
      other: this.cardInfo.department[0],
      company: this.cardInfo.company[0]
    })

    this.abstractForm.patchValue({
      name: this.cardInfo.name,
      title: this.cardInfo.title[0],
      company: this.cardInfo.company[0],
      group: '',
      notify: ''
    })
  }
}
