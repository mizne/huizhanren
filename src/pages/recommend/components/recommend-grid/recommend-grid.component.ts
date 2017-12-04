import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Recommend } from '../../models/recommend.model'

@Component({
  selector: 'recommend-grid',
  templateUrl: 'recommend-grid.component.html'
})
export class RecommendGridComponent implements OnInit {
  activeId: string

  @Input() expand: boolean

  @Input() type: string

  @Input() dataItems: Recommend[]

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {}

  ensureShow(id: string) {
    this.showDetail.emit(id)

    this.activeId = id
  }
}
