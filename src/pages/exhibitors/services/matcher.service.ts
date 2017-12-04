import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { Matcher } from '../models/matcher.model'
import { Exhibitor } from '../models/exhibitor.model'

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
  private fetchUrl: string = '/data/ExhibitionInvitationInfo'
  private insertUrl = '/data/insert/ExhibitionInvitationInfo'
  private agreeUrl: string = '/data/insert/User'
  private refuseUrl: string = '/data/insert/User'

  constructor(private http: HttpClient, private tenantService: TenantService) {}

  /**
   * 获取 发出的或收到的约请记录
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Matcher[]>}
   * @memberof MatcherService
   */
  fetchMatchers(pageIndex: number, pageSize: number): Observable<Matcher[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.get(this.fetchUrl + `?role=E&tenantId=${tenantId}`)
      })
      .map(e => (e as APIResponse).result)
      .map(e => e.map(Matcher.convertFromResp))
      .catch(this.handleError)

    // return Observable.of(fakeMatchers)
  }

  // createMatcher(
  //   recommend: Exhibitor,
  //   boothArea: string,
  //   tenantId: string,
  //   customerId: string
  // ): Observable<any> {
  //   const params = Recommend.convertFromModel(recommend)
  //   Object.assign(params, {
  //     Place: boothArea,
  //     State: '未审核',
  //     Initator: tenantId,
  //     Receiver: customerId
  //   })

  //   console.log(params)

  //   return this.tenantService
  //     .getTenantIdAndUserId()
  //     .mergeMap(([tenantId, userId]) => {
  //       return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
  //         params: {
  //           record: params
  //         }
  //       })
  //     })
  //     .catch(this.handleError)
  // }

  /**
   * 同意约请 TODO
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
   * 拒绝约请 TODO
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
