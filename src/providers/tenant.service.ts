import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State } from '../pages/customer/reducers/index'
import {
  getTenantId,
  getUserId,
  getSelectedExhibitionId,
  getExhibitions
 } from '../pages/login/reducers/index'

@Injectable()
export class TenantService {
  constructor(
    private store: Store<State>,
  ) {}

  getTenantId(): Observable<string> {
    return this.store.select(getTenantId)
  }

  getTenantIdAndUserId(): Observable<[string, string]> {
    return Observable.zip(this.store.select(getTenantId), this.store.select(getUserId))
  }

  getTenantIdAndUserIdAndSelectedExhibitionId(): Observable<[string, string, string]> {
    return Observable.zip(
      this.store.select(getTenantId),
      this.store.select(getUserId),
      this.store.select(getSelectedExhibitionId)
    )
  }

  getTenantIdAndExhibitionId(): Observable<[string, string]> {
    return Observable.zip(this.store.select(getTenantId), this.store.select(getSelectedExhibitionId))
  }

  getSelectedItemName(): Observable<string> {
    return Observable.zip(
      this.store.select(getExhibitions),
      this.store.select(getSelectedExhibitionId)
    )
    .map(([exhibitions, id]) => exhibitions.find(e => e.id === id).name)
  }

  getTenantIdAndItemName(): Observable<[string, string]> {
    return Observable.zip(
      this.store.select(getTenantId),
      this.getSelectedItemName()
    )
  }
}
