import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-customer-abstract',
  templateUrl: 'customer-abstract.component.html',
})
export class HzCustomerAbstractComponent implements OnInit {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()

  @Input() detail: any

  constructor() {}

  ngOnInit() {
  }

  ensureInvite() {
    this.invite.emit()
  }
}
