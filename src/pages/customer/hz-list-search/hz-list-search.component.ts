import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hz-list-search',
  template: `
    <div class="hz-list-search">
      <ng-content></ng-content>
    </div>
  `,
})

export class HzListSearchComponent implements OnInit {
  constructor() { }
  ngOnInit() { }
}