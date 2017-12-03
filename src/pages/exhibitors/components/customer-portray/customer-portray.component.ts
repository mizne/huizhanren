import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-customer-portray',
  templateUrl: 'customer-portray.component.html',
})
export class HzCustomerPortrayComponent implements OnInit {
  @Input() portray: any

  constructor() {}

  ngOnInit() {
  }
}
