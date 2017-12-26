import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store'
import { Observable } from 'rxjs/Observable'
import { State, getSelectedCustomers, getGroups } from '../../reducers/index'
import { CancelSelectCustomerAction, ToCreateAction, ToRenameGroupAction, ToDeleteGroupAction } from '../../actions/group.action'
import { PreBatchEditGroupAction, ToListableStatusAction } from '../../actions/customer.action'

import { Group } from '../../models/group.model'

@Component({
  selector: 'hz-customer-group-manage',
  template: `
    <div class="hz-customer-group-manage">
      <hz-customer-manage-header type="group" [item]="headerItem$ | async"></hz-customer-manage-header>

      <div class="hz-group-content">
        <div class="hz-group-item" *ngFor="let item of contentItems$ | async">
          <span class="hz-group-name">{{item.name}}</span>
          <ion-icon tappable class="hz-group-action" name="close" (click)="close(item.id)"></ion-icon>
        </div>
      </div>

      <hz-customer-manage-template type="group" [templates]="groups$ | async"
      (createTemplate)="toCreateTemplate($event)" (saveTemplate)="saveGroup($event)"
      (renameGroup)="toRenameGroup($event)" (delGroup)="toDelGroup($event)"
      (cancelGroup)="cancelGroup()"></hz-customer-manage-template>
    </div>
  `
})
export class HzCustomerGroupManageComponent implements OnInit {
  item$: Observable<any>
  contentItems$: Observable<any>
  headerItem$: Observable<any>
  groups$: Observable<any>

  constructor(private store: Store<State>) {
    this.item$ = this.store.select(getSelectedCustomers)
    .map((customers) => {
      return {
        headerLabel: '客户',
        customers: customers.map(e => ({
          id: e.id,
          name: e.name,
          items: e.phones
        }))
      }
    })

    this.contentItems$ = this.item$
    .map(item => item.customers)

    this.headerItem$ = this.item$.map(item => ({
      label: item.headerLabel,
      number: item.customers.length
    }))

    this.groups$ = this.store.select(getGroups)
    .map(groups => groups.map(e => ({id: e.id, label: e.name, preview: ''})))
  }

  ngOnInit() {
  }

  close(id: string): void {
    this.store.dispatch(new CancelSelectCustomerAction(id))
  }

  cancelGroup() {
    this.store.dispatch(new ToListableStatusAction())
  }

  toCreateTemplate() {
    this.store.dispatch(new ToCreateAction())
  }

  saveGroup(groupId: string) {
    this.store.dispatch(new PreBatchEditGroupAction(groupId))
  }

  toRenameGroup(group: Group) {
    this.store.dispatch(new ToRenameGroupAction(group))
  }

  toDelGroup(group: Group) {
    this.store.dispatch(new ToDeleteGroupAction(group))
  }

}
