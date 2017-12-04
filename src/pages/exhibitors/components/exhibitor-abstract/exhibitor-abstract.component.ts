import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { Exhibitor } from '../../models/exhibitor.model'

@Component({
  selector: 'hz-exhibitor-abstract',
  templateUrl: 'exhibitor-abstract.component.html'
})
export class HzExhibitorAbstractComponent implements OnInit {
  @Output() invite: EventEmitter<void> = new EventEmitter<void>()
  @Input() detail: Exhibitor

  ngOnInit() {}

  ensureInvite() {
    this.invite.emit()
  }
}
