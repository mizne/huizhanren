import { Component, Input } from '@angular/core'

@Component({
  selector: 'hz-rate',
  templateUrl: './rate.component.html'
})
export class HzRateComponent {
  @Input() number: number = 4
  arr = [1, 2, 3, 4, 5]
}
