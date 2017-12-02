import { Component, OnInit, Input } from '@angular/core'

import { Recommend } from '../../models/recommend.model'

@Component({
  selector: 'recommend-grid',
  templateUrl: 'recommend-grid.component.html'
})
export class RecommendGridComponent implements OnInit {

  @Input() expand: boolean

  @Input() type: string

  @Input() dataItems: Recommend[]

  constructor() {}

  ngOnInit() {}
}
