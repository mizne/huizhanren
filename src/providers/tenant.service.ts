import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'

import { Storage } from '@ionic/storage'

import { Store } from '@ngrx/store'
import { State } from '../pages/customer/reducers/index'
import {
  getTenantId,
  getUserId,
  getSelectedExhibitionId,
  getExhibitions,
  getCompanyName,
  getExhibitorId,
  getBoothNo
} from '../pages/login/reducers'

import {
  getShowDetailCustomer,
  getSelectedCustomers
} from '../pages/customer/reducers'
import { Customer } from '../pages/customer/models/customer.model';

@Injectable()
export class TenantService {
  constructor(private store: Store<State>, private storage: Storage) {}

  public getLoginName(): Promise<string> {
    return this.storage.get('@@HuiZhanRen_LoginName')
  }

  public setLoginName(name: string): Promise<any> {
    return this.storage.set('@@HuiZhanRen_LoginName', name)
  }

  public hasVerify(phone: string): Promise<boolean> {
    return this.getLoginName().then(name => {
      return name === phone
    })
  }

  public getTenantId(): Observable<string> {
    return this.store.select(getTenantId)
  }

  public getExhibitorId(): Observable<string> {
    return this.store.select(getExhibitorId)
  }

  public getTenantIdAndUserId(): Observable<[string, string]> {
    return Observable.zip(
      this.store.select(getTenantId),
      this.store.select(getUserId)
    )
  }

  public getTenantIdAndUserIdAndCompanyName(): Observable<
    [string, string, string]
  > {
    return Observable.zip(
      this.store.select(getTenantId),
      this.store.select(getUserId),
      this.store.select(getCompanyName)
    )
  }

  public getTenantIdAndUserIdAndExhibitorIdAndExhibitionId(): Observable<
    [string, string, string, string]
  > {
    return Observable.zip(
      this.store.select(getTenantId),
      this.store.select(getUserId),
      this.store.select(getExhibitorId),
      this.store.select(getSelectedExhibitionId)
    )
  }

  public getSelectedItemName(): Observable<string> {
    return Observable.zip(
      this.store.select(getExhibitions),
      this.store.select(getSelectedExhibitionId)
    ).map(([exhibitions, id]) => exhibitions.find(e => e.id === id).name)
  }

  public getTenantIdAndItemName(): Observable<[string, string]> {
    return Observable.zip(
      this.store.select(getTenantId),
      this.getSelectedItemName()
    )
  }

  public getSingleSendSmsParams(phone: string): Observable<{
    phone: string,
    customer: Customer,
    companyName: string,
    boothNo: string
  }> {
    return this.store
      .select(getShowDetailCustomer)
      .withLatestFrom(
        Observable.zip(
          this.store.select(getCompanyName),
          this.store.select(getBoothNo)
        ),
        (customer, [companyName, boothNo]) => {
          return {
            phone, customer, companyName, boothNo
          }
        }
      )
  }

  public getBatchSendSmsParams(): Observable<{
    customers: Customer[],
    companyName: string,
    boothNo: string
  }> {
    return this.store
      .select(getSelectedCustomers)
      .withLatestFrom(
        Observable.zip(
          this.store.select(getCompanyName),
          this.store.select(getBoothNo)
        ),
        (customers, [companyName, boothNo]) => {
          return {
            customers, companyName, boothNo
          }
        }
      )
  }
}
