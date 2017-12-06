import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { ExhibitorMatcherStatus } from '../../models/matcher.model'

@Component({
  selector: 'exhibitor-matcher-filter',
  templateUrl: 'matcher-filter.component.html',
})
export class HzMatcherFilterComponent implements OnInit {
  @Input() filterSub: Subject<ExhibitorMatcherStatus[]>
  @Input()　expand: boolean

  allowControl: FormControl = new FormControl(false)
  refuseControl: FormControl = new FormControl(false)
  unAuditControl: FormControl = new FormControl(false)
  notAllowAuditControl: FormControl = new FormControl(false)
  unReplyControl: FormControl = new FormControl(false)

  constructor() {}

  ngOnInit() {
    Observable.combineLatest(
      this.unAuditControl.valueChanges.startWith(false),
      this.notAllowAuditControl.valueChanges.startWith(false),
      this.unReplyControl.valueChanges.startWith(false),
      this.allowControl.valueChanges.startWith(false),
      this.refuseControl.valueChanges.startWith(false),
    )
    .skip(1)
    .map((args) => {
      return args.map((e, i) => ({
        matcherStatus: i,
        matcherStatusValue: e
      })).filter(e => e.matcherStatusValue).map(e => e.matcherStatus)
    })
    .subscribe(this.filterSub)
  }
}
