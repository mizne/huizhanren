import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core'

import { RecommendExhibitor } from '../../models/exhibitor.model'

@Component({
  selector: 'exhibitor-grid',
  templateUrl: 'exhibitor-grid.component.html'
})
export class ExhibitorGridComponent implements OnInit, OnDestroy {
  private gridContainers: HTMLElement[] = []
  @ViewChild('gridContainer')
  set gridContainer(v: ElementRef) {
    if (v) {
      const index = this.gridContainers.indexOf(v.nativeElement)
      if (index === -1) {
        this.gridContainers.push(v.nativeElement)
      }
    }
  }

  @Input() expand: boolean
  @Input() type: string
  @Input() dataItems: RecommendExhibitor[]
  @Input() showLoadMore: boolean
  @Input()
  set shouldScrollToTop(v: boolean) {
    if (v) {
      this.gridContainers.forEach(e => {
        e.scrollTop = 0
      })
    }
  }

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()
  @Output() cancelMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() agreeMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() refuseMatcher: EventEmitter<string> = new EventEmitter<string>()
  @Output() loadMore: EventEmitter<void> = new EventEmitter<void>()

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.gridContainers.length = 0
  }

  onScroll() {
    this.loadMore.emit()
  }

  ensureShow(item: RecommendExhibitor) {
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

  ensureLoadMore() {
    this.loadMore.emit()
  }
}
