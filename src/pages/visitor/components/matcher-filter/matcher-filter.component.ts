import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms'
import { Observable } from 'rxjs/Observable'

import { VisitorMatcherStatus } from '../../models/matcher.model'
import { ListStatus } from '../../models/visitor.model'

@Component({
  selector: 'hz-matcher-filter',
  templateUrl: 'matcher-filter.component.html'
})
export class HzMatcherFilterComponent implements OnInit {
  COMPLETE_MATCHER_GRID = ListStatus.COMPLETE
  filterStatusActiveIndex = 0
  filterDirectionActiveIndex = 0

  @Input() filterSub: Subject<VisitorMatcherStatus[]>
  @Input() listStatus: number
  @Input() expand: boolean

  ngOnInit() {
    Observable.combineLatest()
      .skip(1)
      .map(args => {
        return args
          .map((e, i) => ({
            matcherStatus: i,
            matcherStatusValue: e
          }))
          .filter(e => e.matcherStatusValue)
          .map(e => e.matcherStatus)
      })
      .do(console.log)
      .subscribe(this.filterSub)
  }
}
