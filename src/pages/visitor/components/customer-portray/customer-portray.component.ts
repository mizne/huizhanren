import { Component, Input } from '@angular/core'

@Component({
  selector: 'hz-customer-portray',
  templateUrl: 'customer-portray.component.html',
})
export class HzCustomerPortrayComponent {
  @Input() portray: any
  @Input() theme: string

  constructor() {}

  ngOnInit() {
  }
}
