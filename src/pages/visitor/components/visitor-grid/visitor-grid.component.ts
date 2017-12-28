import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { RecommendVisitor } from '../../models/visitor.model'

@Component({
  selector: 'visitor-grid',
  templateUrl: 'visitor-grid.component.html'
})
export class VisitorGridComponent implements OnInit {
  activeId: string

  @Input() expand: boolean

  @Input() type: string

  @Input() dataItems: RecommendVisitor[]

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {}

  ensureShow(id: string) {
    this.showDetail.emit(id)
    this.activeId = id
  }

  ensureAgreeMatcher(id: string) {
    this.agreeMatcher.emit(id)
  }

  ensureRefuseMatcher(id: string) {
    this.refuseMatcher.emit(id)
  }
}
