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

import { Visitor } from '../../models/visitor.model'
import { isInViewport } from '../../../customer/services/utils'
import { HzLoadMoreComponent } from '../../../../shared/components/load-more/load-more.component'

@Component({
  selector: 'visitor-grid',
  templateUrl: 'visitor-grid.component.html'
})
export class VisitorGridComponent implements OnInit, OnDestroy {
  private gridContainers: HTMLElement[] = []
  @ViewChild('gridExpand')
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
  @Input() dataItems: Visitor[]
  @Input() showLoadMore: boolean
  @Input()
  set shouldScrollToTop(v: boolean) {
    if (v) {
      this.gridContainers.forEach(e => {
        e.scrollTop = 0
      })
    }
  }

  @Output() invite: EventEmitter<string> = new EventEmitter<string>()
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

  ensureInvite(id: string) {
    this.invite.emit(id)
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
