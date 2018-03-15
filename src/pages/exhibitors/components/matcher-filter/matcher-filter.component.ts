import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'

import {
  ExhibitorMatcherStatus,
  ExhibitorMatcherDirection
} from '../../models/matcher.model'
import { ListStatus } from '../../models/exhibitor.model'

export interface ToDoFilterOptions {
  status?: ExhibitorMatcherStatus
  direction: ExhibitorMatcherDirection
}

@Component({
  selector: 'exhibitor-matcher-filter',
  templateUrl: 'matcher-filter.component.html'
})
export class ExhibitorMatcherFilterComponent implements OnInit {
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE

  filterStatusActive = ExhibitorMatcherStatus.ANY
  filterDirectionActive = ExhibitorMatcherDirection.ANY

  STATUS_ANY = ExhibitorMatcherStatus.ANY
  STATUS_PENDING = ExhibitorMatcherStatus.UN_AUDIT
  STATUS_ENREPLY = ExhibitorMatcherStatus.AUDIT_SUCCEED

  DIRECTION_ANY = ExhibitorMatcherDirection.ANY
  DIRECTION_FROM_ME = ExhibitorMatcherDirection.FROM_ME
  DIRECTION_TO_ME = ExhibitorMatcherDirection.TO_ME

  @Input() listStatus: number
  @Input() expand: boolean
  @Output()
  toDoFilter: EventEmitter<ToDoFilterOptions> = new EventEmitter<
    ToDoFilterOptions
  >()
  @Output()
  completeFilter: EventEmitter<ExhibitorMatcherDirection> = new EventEmitter<
    ExhibitorMatcherDirection
  >()
  @Output() batchAgree: EventEmitter<void> = new EventEmitter<void>()

  ngOnInit() {}

  ensureStatus(status: ExhibitorMatcherStatus) {
    this.filterStatusActive = status
    if (this.listStatus === ListStatus.TODO) {
      this.toDoFilter.emit({
        status: this.filterStatusActive,
        direction: this.filterDirectionActive
      })
    }
  }

  ensureDirection(direction: ExhibitorMatcherDirection) {
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
