import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { Matcher } from '../models/matcher.model'
import { fakeJson } from '../../../fake/fake';

const fakeMatchers: Matcher[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i),
  name: `testName${i}`,
  title: `testTitle${i}`,
  company: `testCompany${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`,
  status: 0
}))

@Injectable()
export class MatcherService {
  private fetchUrl: string = '/data/querybycondition/User'
  private agreeUrl: string = '/data/insert/User'
  private refuseUrl: string = '/data/insert/User'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  /**
   * 获取 发出的或收到的约请记录
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Matcher[]>}
   * @memberof MatcherService
   */
  fetchMatchers(pageIndex: number, pageSize: number): Observable<Matcher[]> {
    // return this.tenantService
    //   .getTenantIdAndUserId()
    //   .mergeMap(([tenantId, userId]) => {
    //     return this.http.post(this.fetchUrl + `/${tenantId}/${userId}`, {})
    //   })
    //   .catch(this.handleError)

    return Observable.of(fakeMatchers)
  }

  /**
   * 同意约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  agreeMatcher(matcherId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.agreeUrl + `/${tenantId}/${userId}`, {})
      })
      .catch(this.handleError)
  }

  /**
   * 拒绝约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  refuseMatcher(matcherId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.refuseUrl + `/${tenantId}/${userId}`, {})
      })
      .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
