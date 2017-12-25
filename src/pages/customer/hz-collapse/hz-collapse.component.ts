import {
  Component,
  ViewEncapsulation,
  Input,
  ElementRef,
  Host,
  HostBinding,
  Output,
  EventEmitter
} from '@angular/core';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector     : 'hz-collapseset',
  encapsulation: ViewEncapsulation.None,
  template     : `
    <div class="hz-collapse">
      <ng-content></ng-content>
    </div>
  `,
})
export class HzCollapsesetComponent {
  /**
   * all child collapse
   * @type {Array}
   */
  panels: Array<HzCollapseComponent> = [];

  addTab(collapse: HzCollapseComponent) {
    this.panels.push(collapse);
  }

  constructor() {
  }
}


@Component({
  selector     : 'hz-collapse',
  template     : `
    <div class="hz-collapse-header" tappable [attr.aria-expanded]="nzActive" (click)="clickHeader($event)" role="tab">
      <ion-checkbox [(ngModel)]="_selected" tappable (ionChange)="change()"></ion-checkbox>
      <ion-label margin-left="10px">{{nzTitle + ' ( ' + num + ' )'}}</ion-label>
      <ion-icon float-right class="icon" name="arrow-down" *ngIf="nzActive"></ion-icon>
      <ion-icon float-right class="icon" name="arrow-forward" *ngIf="!nzActive"></ion-icon>
    </div>
    <div class="hz-collapse-content" [scrollTop]="scrollTopHeight" [@collapseState]="nzActive?'active':'inactive'" (scroll)="scrollHandler($event)">
      <ng-content></ng-content>
    </div>
  `,
  animations   : [
    trigger('collapseState', [
      state('inactive', style({
        opacity: '0',
        height : 0,
        display: 'none'
      })),
      state('active', style({
        opacity: '1',
        height : '*',
        display: 'block'
      })),
      transition('inactive => active', animate('150ms ease-in')),
      transition('active => inactive', animate('150ms ease-out'))
    ])
  ]
})
export class HzCollapseComponent {
  _el;

  _selected;

  private timeId: number

  @Input() nzActive: boolean;

  @Input()
  set nzSelected(se) {
    this._selected = se
  }

  @Input()
  scrollTopHeight: any

  @HostBinding('class.hz-collapse-item') _nzCollapseItem = true;

  @Input() nzTitle: string;
  @Input() num: string;
  @Input()
  @HostBinding('class.hz-collapse-item-disabled')
  nzDisabled = false;

  @Output() toggleActive: EventEmitter<void> = new EventEmitter<void>()

  @Output() toggleSelect: EventEmitter<void> = new EventEmitter<void>()

  @Output() scrollTop: EventEmitter<number> = new EventEmitter<number>()


  get title(): string {
    return `${this.nzTitle}(${this.num})`
  }

  change() {
    this.toggleSelect.emit()
  }

  clickHeader() {
    this.toggleActive.emit()
  }

  clickCheckbox($event: Event): void {
    $event.stopPropagation()
  }

  scrollHandler(ev: Event) {
    const scrollTop = (ev.target as HTMLDivElement).scrollTop

    if (this.timeId) {
      window.clearTimeout(this.timeId)
    }

    this.timeId = window.setTimeout(() => {
      this.scrollTop.emit(scrollTop)
    }, 200)
  }

  constructor(@Host() private _collapseSet: HzCollapsesetComponent, private _elementRef: ElementRef) {
    this._el = this._elementRef.nativeElement;
    this._collapseSet.addTab(this);
  }
}
