import { Component, OnInit, Input } from '@angular/core'

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
