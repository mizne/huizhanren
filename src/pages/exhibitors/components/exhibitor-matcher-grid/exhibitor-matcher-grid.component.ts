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

import { Exhibitor } from '../../models/exhibitor.model'
import { isInViewport } from '../../../customer/services/utils'
import { HzLoadMoreComponent } from '../../../../shared/components/load-more/load-more.component'

@Component({
  selector: 'exhibitor-matcher-grid',
  templateUrl: 'exhibitor-matcher-grid.component.html'
})
export class ExhibitorMatcherGridComponent implements OnInit, OnDestroy {
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
  @Input() dataItems: Exhibitor[]
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

  ensureShow(id) {
    this.showDetail.emit(id)
    console.log(`ensure show exhibitor matcher id: ${id}`)
  }

  ensureAgree(id: string) {
    this.agreeMatcher.emit(id)
  }

  ensureRefuse(id: string) {
    this.refuseMatcher.emit(id)
  }

  ensureLoadMore() {
    this.loadMore.emit()
  }
}
