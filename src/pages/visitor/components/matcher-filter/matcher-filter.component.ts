import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'

import {
  VisitorMatcherStatus,
  VisitorMatcherDirection
} from '../../models/matcher.model'
import { ListStatus } from '../../models/visitor.model'

export interface ToDoFilterOptions {
  status?: VisitorMatcherStatus
  direction: VisitorMatcherDirection
}

@Component({
  selector: 'visitor-matcher-filter',
  templateUrl: 'matcher-filter.component.html'
})
export class HzMatcherFilterComponent implements OnInit {
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE

  filterStatusActive = VisitorMatcherStatus.ANY
  filterDirectionActive = VisitorMatcherDirection.ANY

  STATUS_ANY = VisitorMatcherStatus.ANY
  STATUS_PENDING = VisitorMatcherStatus.UN_AUDIT
  STATUS_ENREPLY = VisitorMatcherStatus.AUDIT_SUCCEED

  DIRECTION_ANY = VisitorMatcherDirection.ANY
  DIRECTION_FROM_ME = VisitorMatcherDirection.FROM_ME
  DIRECTION_TO_ME = VisitorMatcherDirection.TO_ME

  @Input() listStatus: number
  @Input() expand: boolean
  @Output()
  toDoFilter: EventEmitter<ToDoFilterOptions> = new EventEmitter<
    ToDoFilterOptions
  >()
  @Output()
  completeFilter: EventEmitter<VisitorMatcherDirection> = new EventEmitter<
    VisitorMatcherDirection
  >()
  @Output() batchAgree: EventEmitter<void> = new EventEmitter<void>()

  ngOnInit() {}

  ensureStatus(status: VisitorMatcherStatus) {
    this.filterStatusActive = status
    if (this.listStatus === ListStatus.TODO) {
      this.toDoFilter.emit({
        status: this.filterStatusActive,
        direction: this.filterDirectionActive
      })
    }
  }

  ensureDirection(direction: VisitorMatcherDirection) {
    this.filterDirectionActive = direction
    if (this.listStatus === ListStatus.TODO) {
      this.toDoFilter.emit({
        status: this.filterStatusActive,
        direction: this.filterDirectionActive
      })
    } else {
      this.completeFilter.emit(this.filterDirectionActive)
    }
  }

  toBatchAgree() {
    if (this.listStatus === ListStatus.TODO) {
      this.batchAgree.emit()
    }
  }
}
