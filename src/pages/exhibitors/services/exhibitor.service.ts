import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { Exhibitor } from '../models/exhibitor.model'

const fakeExhibitors: Exhibitor[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i),
  name: `testName${i}`,
  logo: './assets/images/card.jpg',
  booth: `testBooth${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`,
  heat: i
}))

@Injectable()
export class ExhibitorService {
  private fetchUrl: string = '/data/querybycondition/User'
  private inviteUrl: string = '/data/insert/User'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  /**
   * 获取推荐展商 分页请求
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Recommend[]>}
   * @memberof RecommendService
   */
  fetchExhibitors(pageIndex: number, pageSize: number): Observable<Exhibitor[]> {
    // return this.tenantService
    //   .getTenantIdAndUserId()
    //   .mergeMap(([tenantId, userId]) => {
    //     return this.http.post(this.fetchUrl + `/${tenantId}/${userId}`, {})
    //   })
    //   .catch(this.handleError)

    return Observable.of(fakeExhibitors)
  }
  /**
   * 约请某个推荐展商
   *
   * @param {string} exhibitorID
   * @returns {Observable<any>}
   * @memberof RecommendService
   */
  inviteExhibitor(exhibitorID: string): Observable<any> {
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
