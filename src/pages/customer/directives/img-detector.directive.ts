import { Directive, ElementRef, Renderer2, Input } from '@angular/core'

@Directive({ selector: '[imgDetector]' })
export class ImgDetectorDirective {
  private img

  @Input() imgDetector: string

  constructor(private el: ElementRef, private rd: Renderer2) {
    const self = this
    this.img = this.el.nativeElement
    this.img.onload = function(ev) {
      console.log(`width: ${this.width}; height: ${this.height}`)
      if (this.height > this.width) {
        self.addTransform()
      } else {
        self.removeTransform()
      }
    }
  }

  private addTransform() {
    if (this.img) {
      if (this.imgDetector === 'editable') {
        this.rd.setStyle(
          this.img,
          'transform',
          'scale(0.7) rotate(-90deg) translateX(61%)'
        )
      }
      if (this.imgDetector === 'detailable') {
        this.rd.setStyle(
          this.img,
          'transform',
          'scale(0.7) rotate(-90deg) translateX(-63%)'
        )
      }

      this.rd.setStyle(this.img, 'width', '310px')
      this.rd.setStyle(this.img, 'height', '460px')
    }
  }

  private removeTransform() {
    if (this.img) {
      if (this.imgDetector === 'editable') {
        this.rd.setStyle(this.img, 'transform', 'none')
      }
      if (this.imgDetector === 'detailable') {
        this.rd.setStyle(this.img, 'transform', 'none')
      }
    }
  }
}
