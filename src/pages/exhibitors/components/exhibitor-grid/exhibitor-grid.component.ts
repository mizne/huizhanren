import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

import { Exhibitor } from '../../models/exhibitor.model'

@Component({
  selector: 'exhibitor-grid',
  templateUrl: 'exhibitor-grid.component.html'
})
export class ExhibitorGridComponent implements OnInit {

  @Input() expand: boolean

  @Input() type: string

  @Input() dataItems: Exhibitor[]

  @Output() showDetail: EventEmitter<string> = new EventEmitter<string>()

  constructor() {}

  ngOnInit() {}

  ensureShow(item: Exhibitor) {
    item.selected = !item.selected
    this.showDetail.emit(item.id)
  }
}
