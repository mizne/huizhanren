import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Subject } from 'rxjs/Subject'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'hz-rate',
  templateUrl: './rate.component.html'
})
export class HzRateComponent implements OnInit {
  @Input() number: number = 4

  arr = [1, 2, 3, 4, 5]

  constructor() {}

  ngOnInit() {}
}
