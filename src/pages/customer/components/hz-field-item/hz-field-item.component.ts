import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hz-field-item',
  template: `
    <div class="hz-field-item">
      <div class="hz-field-title">
        <span class="hz-title-text">{{field.title}}</span>
        <ion-icon *ngIf="!field.single" tappable class="hz-icon" name="add-circle" (click)="addItem()"></ion-icon>
      </div>
      <ng-template [ngIf]="field.single">
        <div class="hz-field-single">
          <input class="hz-field-input" [(ngModel)]="field.value">
        </div>
      </ng-template>
      <ng-template [ngIf]="!field.single">
        <div class="hz-field-multi" *ngFor="let item of field.items; let i = index;">
          <span class="hz-field-label">
            <input [(ngModel)]="item.label">
          </span>
          <span class="hz-field-value">
            <input type="text" [(ngModel)]="item.value">

          </span>
          <ion-icon class="hz-icon" tappable name="close" (click)="removeItem(i)"></ion-icon>
        </div>
      </ng-template>
    </div>

  `,
})

export class HzFieldItemComponent implements OnInit {

  @Input() field: any

  constructor() { }

  ngOnInit() { }

  addItem() {
    this.field.items.push({
      label: '',
      value: '',
      name: ''
    })
  }

  removeItem(index) {
    this.field.items.splice(index, 1)
  }
}
