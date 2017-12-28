import { Component, Input } from '@angular/core'

@Component({
  selector: 'hz-customer-status',
  templateUrl: 'customer-status.component.html',
})
export class HzCustomerStatusComponent {
  @Input() helpActive: boolean = false
  @Input() inviteCount: number = 1
  @Input() presentActive: boolean = true
}
