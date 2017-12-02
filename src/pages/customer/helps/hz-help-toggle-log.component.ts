import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { State } from '../reducers'
import { HasShowedHlepOfToggleLogAction } from '../actions/helper.action'

@Component({
  selector: 'hz-help-toggle-log',
  template: `
    <div class="hz-help-toggle-log" (click)="close()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .hz-help-toggle-log {
      position: absolute;
      top: 60px;
      right: 25px;
      background-color: #c78859;
      width: 120px;
      height: 60px;
      border-radius: 10px;
      z-index: 100;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: white;
    }

    .hz-help-toggle-log:before {
      position: absolute;
      top: -5px;
      right: 13px;
      content: "";
      height: 0;
      width: 0;
      border-bottom: 6px solid #c78859;
      border-left: 6px dashed transparent;
      border-right: 6px dashed transparent;
    }
  `]
})

export class HzHelpToggleLogComponent implements OnInit {
  private timeId: number

  constructor(private store: Store<State>) { 
  }

  ngOnInit() { 
    this.timeId = window.setTimeout(() => {
      this.store.dispatch(new HasShowedHlepOfToggleLogAction())
    }, 3e3)
  }

  close() {
    if (this.timeId) {
      window.clearTimeout(this.timeId)
    }

    this.store.dispatch(new HasShowedHlepOfToggleLogAction())
  }
}