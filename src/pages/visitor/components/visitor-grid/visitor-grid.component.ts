import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild
} from '@angular/core'
import { Subject } from 'rxjs/Subject'

import { RecommendVisitor } from '../../models/visitor.model'
import { isInViewport } from '../../../customer/services/utils'
import { HzLoadMoreComponent } from '../../../../shared/components/load-more/load-more.component'

@Component({
  selector: 'visitor-grid',
  templateUrl: 'visitor-grid.component.html'
})
export class VisitorGridComponent implements OnInit, OnDestroy {
  activeId: string
  private gridContainers: HTMLElement[] = []
  @ViewChild('gridExpand')
  set gridExpand(v: ElementRef) {
    if (v) {
      const index = this.gridContainers.indexOf(v.nativeElement)
      if (index === -1) {
        this.gridContainers.push(v.nativeElement)
      }
    }
  }
  @ViewChild('gridNoExpand')
  set gridNoExpand(v: ElementRef) {
    if (v) {
      const index = this.gridContainers.indexOf(v.nativeElement)
      if (index === -1) {
        this.gridContainers.push(v.nativeElement)
      }
    }
  }

  @Input() expand: boolean
  @Input() type: string
  @Input() dataItems: RecommendVisitor[]
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
