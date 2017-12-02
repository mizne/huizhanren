import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { Store } from '@ngrx/store'
import { State } from '../pages/customer/reducers/index'
import {
  getTenantId,
  getUserId,
 } from '../pages/login/reducers/index'

@Injectable()
export class TenantService {
  constructor(
    private store: Store<State>,
  ) {}

  getTenantIdAndUserId(): Observable<[string, string]> {
    return Observable.zip(this.store.select(getTenantId), this.store.select(getUserId))
  }
}
