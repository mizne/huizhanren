import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { trigger, state, style, animate, transition } from '@angular/animations'
import { ListHeaderEvent, ListStatus } from '../../../pages/visitor/models/visitor.model'

@Component({
  selector: 'hz-grid-header',
  templateUrl: 'grid-header.component.html',
  animations: [
    trigger('collapseState', [
      state(
        'inactive',
        style({
          display: 'none'
        })
      ),
      state(
        'active',
        style({
          display: 'block'
        })
      ),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ])
  ]
})
export class HzGridHeaderComponent implements OnInit {
  activeLeftMore: boolean = false
  activeRightMore: boolean = false
  activeIndex: number

  @Input() leftTotal: number
  @Input() rightTotal: number

  @Input() activeIndexSub: Subject<ListStatus>
  @Input() headerEventSub: Subject<ListHeaderEvent>
  @Input() type: string

  ngOnInit() {
    this.activeIndex = 0
  }

  activeHeader(index: number) {
    this.activeIndex = index
    this.activeIndexSub.next(index)
  }

  showLeftMore(ev: Event) {
    ev.stopPropagation()
    this.activeLeftMore = !this.activeLeftMore
  }

  closeLeftMore() {
    this.activeLeftMore = false
  }

  batchInvite(ev: Event) {
    ev.stopPropagation()
    this.closeLeftMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_INVITE)
  }

  batchHidden(ev: Event) {
    ev.stopPropagation()
    this.closeLeftMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_HIDDEN)
  }

  refresh(ev: Event, leftOrRight: string) {
    ev.stopPropagation()
    if (leftOrRight === 'left') {
      this.closeLeftMore()
    } else {
      this.closeRigthMore()
    }
    this.headerEventSub.next(ListHeaderEvent.REFRESH)
  }

  showRightMore(ev: Event) {
    ev.stopPropagation()
    this.activeRightMore = !this.activeRightMore
  }

  closeRigthMore() {
    this.activeRightMore = false
  }

  batchAccept(ev: Event) {
    ev.stopPropagation()
    this.closeRigthMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_ACCEPT)
  }

  batchRefuse(ev: Event) {
    ev.stopPropagation()
    this.closeRigthMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_REFUSE)
  }

  batchCancel(ev: Event) {
    ev.stopPropagation()
    this.closeRigthMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_CANCEL)
  }

  batchDelete(ev: Event) {
    ev.stopPropagation()
    this.closeRigthMore()
    this.headerEventSub.next(ListHeaderEvent.BATCH_DELETE)
  }

}
