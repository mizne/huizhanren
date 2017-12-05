import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Exhibitor } from '../../models/exhibitor.model'

@Component({
  selector: 'exhibitor-grid',
  templateUrl: 'exhibitor-grid.component.html'
})
export class ExhibitorGridComponent implements OnInit {

  @Input() expand: boolean

  @Input() type: string

  @Input() dataItems: Exhibitor[]

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {}

  ensureShow(item: Exhibitor) {
    item.selected = !item.selected
    this.showDetail.emit(item.id)
  }

  ensureCancelMatcher(id: string) {
    this.cancelMatcher.emit(id)
  }

  ensureAgreeMatcher(id: string) {
    this.agreeMatcher.emit(id)
  }

  ensureRefuseMatcher(id: string) {
    this.refuseMatcher.emit(id)
  }
}
