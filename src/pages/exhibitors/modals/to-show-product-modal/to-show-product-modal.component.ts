import { Component, OnInit, ViewChild } from '@angular/core'
import { NavParams, ViewController, Slides } from 'ionic-angular'

import { DestroyService } from '../../../../providers/destroy.service'

@Component({
  templateUrl: './to-show-product-modal.component.html',
  providers: [DestroyService]
})
export class ToShowProductModal implements OnInit {
  name: string
  remark: string
  pictures: string[]
  indicator: string

  @ViewChild(Slides) slides: Slides

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
  ) {}

  ngOnInit() {
    this.name = this.params.get('name')
    this.remark = this.params.get('remark')
    this.pictures = this.params.get('pictures')
    this.indicator = `1/${this.pictures.length}`
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex()
    if (currentIndex >= this.pictures.length) {
      this.indicator = `${this.pictures.length}/${this.pictures.length}`
    } else {
      this.indicator = `${currentIndex + 1}/${this.pictures.length}`
    }
  }

  cancel(): void {
    this.dismiss()
  }

  complete() {
    this.dismiss(true)
  }

  private dismiss(data?): void {
    this.viewCtrl.dismiss(data)
  }
}
