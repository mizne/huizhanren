import { Component, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-logger-item-add',
  templateUrl: './logger-item-add.component.html',
})
export class HzLoggerItemAddComponent {
  @Input() theme: string
  constructor() {}
  ngOnInit() {
  }

  createLogger() {
    console.log('to create logger')
  }
}
