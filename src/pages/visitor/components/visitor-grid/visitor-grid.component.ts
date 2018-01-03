import { Component, Input, Output, EventEmitter } from '@angular/core'

import { RecommendVisitor } from '../../models/visitor.model'

@Component({
  selector: 'visitor-grid',
  templateUrl: 'visitor-grid.component.html'
})
export class VisitorGridComponent {
  activeId: string

  @Input() expand: boolean
  @Input() type: string
  @Input() dataItems: RecommendVisitor[]
  @Input() showLoadMore: boolean

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() loadMore: EventEmitter<void> = new EventEmitter<void>()

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

  ensureLoadMore() {
    this.loadMore.emit()
  }
}
