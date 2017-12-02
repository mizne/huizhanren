import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { Recommend } from '../models/recommend.model'

const fakeRecommends: Recommend[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i),
  name: `testName${i}`,
  title: `testTitle${i}`,
  company: `testCompany${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`,
}))

@Injectable()
export class RecommendService {
  private fetchUrl: string = '/data/querybycondition/User'
  private inviteUrl: string = '/data/insert/User'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  /**
   * 获取推荐客户 分页请求
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Recommend[]>}
   * @memberof RecommendService
   */
  fetchRecommend(pageIndex: number, pageSize: number): Observable<Recommend[]> {
    // return this.tenantService
    //   .getTenantIdAndUserId()
    //   .mergeMap(([tenantId, userId]) => {
    //     return this.http.post(this.fetchUrl + `/${tenantId}/${userId}`, {})
    //   })
    //   .catch(this.handleError)

    return Observable.of(fakeRecommends)
  }
  /**
   * 约请某个推荐客户
   *
   * @param {string} recommendId
   * @returns {Observable<any>}
   * @memberof RecommendService
   */
  InviteRecommend(recommendId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.inviteUrl + `/${tenantId}/${userId}`, {})
      })
      .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
