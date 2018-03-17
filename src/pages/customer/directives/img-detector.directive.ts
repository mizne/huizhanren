import { Directive, ElementRef, Renderer2, Input } from '@angular/core'

@Directive({ selector: '[imgDetector]' })
export class ImgDetectorDirective {
  private img

  @Input() imgDetector: string

  constructor(private el: ElementRef, private rd: Renderer2) {
    const self = this
    this.img = this.el.nativeElement
    this.img.onload = function(ev) {
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
        const transform = `scale(0.6) rotate(-90deg) translateX(${this.computePositionForEdit(
          this.img.height
        )})`
        this.rd.setStyle(this.img, 'transform', transform)

        //  height: 516 0.6 88%
        // height: 481 0.6 -79%
        // height: 469 0.6 75%
        // height: 459 0.6 73%
      }
      if (this.imgDetector === 'detailable') {
        const transform = `scale(0.6) rotate(-90deg) translateX(${this.computePositionForDetail(
          this.img.height
        )})`
        this.rd.setStyle(this.img, 'transform', transform)

        //  height: 559 0.6 -105%
        // height: 521 0.6 -95%
        // height: 508 0.6 -92%
        // height: 497 0.6 -88%
      }
    }
  }

  private removeTransform() {
    if (this.img) {
      if (this.imgDetector === 'editable') {
        this.rd.setStyle(this.img, 'transform', 'none')
      }
      if (this.imgDetector === 'detailable') {
        this.rd.setStyle(this.img, 'transform', 'translateY(14%)')
      }
    }
  }

  private computePositionForEdit(height: number): string {
    const offsetHeight = 516 - height
    const transalteX = 88
    const res = transalteX - offsetHeight / 4
    return String(res) + '%'
  }

  private computePositionForDetail(height: number): string {
    const offsetHeight = 559 - height
    const transalteX = 105
    const res = transalteX - offsetHeight / 3.7
    return String(-res) + '%'
  }
}
