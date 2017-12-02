import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { trigger, state, style, animate, transition } from '@angular/animations'

import { ListHeaderEvent } from '../../models/recommend.model'
import { ListHeader } from 'ionic-angular/components/list/list-header';

import { ListStatus } from '../../models/recommend.model'

@Component({
  selector: 'grid-header',
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
export class GridHeaderComponent implements OnInit {
  activeLeftMore: boolean = false
  activeRightMore: boolean = false

  activeIndex: number

  @Input() activeIndexSub: Subject<ListStatus>
  @Input() headerEventSub: Subject<ListHeaderEvent>

  constructor() {}

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
    this.headerEventSub.next(ListHeaderEvent.BATCH_INVITE)
    this.closeLeftMore()
  }

  batchHidden(ev: Event) {
    ev.stopPropagation()
    this.headerEventSub.next(ListHeaderEvent.BATCH_HIDDEN)
    this.closeLeftMore()
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
    this.headerEventSub.next(ListHeaderEvent.BATCH_ACCEPT)
    this.closeRigthMore()
  }

  batchRefuse(ev: Event) {
    ev.stopPropagation()
    this.headerEventSub.next(ListHeaderEvent.BATCH_REFUSE)
    this.closeRigthMore()
  }

  batchCancel(ev: Event) {
    ev.stopPropagation()
    this.headerEventSub.next(ListHeaderEvent.BATCH_CANCEL)
    this.closeRigthMore()
  }

  batchDelete(ev: Event) {
    ev.stopPropagation()
    this.headerEventSub.next(ListHeaderEvent.BATCH_DELETE)
    this.closeRigthMore()
  }
}
