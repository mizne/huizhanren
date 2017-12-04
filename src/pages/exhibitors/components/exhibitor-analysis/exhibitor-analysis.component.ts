import { Component, OnInit, Input } from '@angular/core'
import { Subject } from 'rxjs/Subject'

@Component({
  selector: 'hz-exhibitor-analysis',
  templateUrl: 'exhibitor-analysis.component.html',
})
export class HzExhibitorAnalysisComponent implements OnInit {
  @Input() portray: any

  constructor() {}

  ngOnInit() {
  }
}
