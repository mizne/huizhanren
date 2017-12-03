import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-customer-status',
  templateUrl: 'customer-status.component.html',
})
export class HzCustomerStatusComponent implements OnInit {
  @Input() helpActive: boolean = false
  @Input() inviteCount: number = 1
  @Input() presentActive: boolean = true

  constructor() {}

  ngOnInit() {
  }
}
