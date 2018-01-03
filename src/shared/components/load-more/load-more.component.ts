import { Component, EventEmitter } from '@angular/core'

@Component({
  selector: 'hz-load-more',
  templateUrl: 'load-more.component.html'
})
export class HzLoadMoreComponent {
  loadMore: EventEmitter<void> = new EventEmitter<void>()

  ensureLoadMore() {
    this.loadMore.emit()
  }
}
