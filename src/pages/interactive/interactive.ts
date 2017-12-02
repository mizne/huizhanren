import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

const urls = [
  'www.baidu.com',
  'www.baidu1.com',
  'www.baidu2.com'
]

@Component({
  selector: 'page-interactive',
  templateUrl: 'interactive.html',
})
export class InteractivePage {
  activeQRCode: boolean = false

  url: string = 'http://dm.huizhanren.com/grant/location/D23F4FC0-6335-47BC-B05C-606F387235F0'
  
  constructor(public navCtrl: NavController) {
  }

  showQRCode(ev, index) {
    ev.stopPropagation()
    this.activeQRCode = !this.activeQRCode
    this.url = urls[index]
  }


}
