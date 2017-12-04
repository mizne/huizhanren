import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import {
  Recommend,
  RecommendResp,
  FetchRecommendParams
} from '../models/recommend.model'

const fakeRecommends: Recommend[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i),
  name: `testName${i}`,
  title: `testTitle${i}`,
  company: `testCompany${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`
}))

@Injectable()
export class RecommendService {
  private fetchUrl: string = '/data/VisiterInfo'

  constructor(private http: HttpClient, private tenantService: TenantService) {}

  /**
   * 获取推荐观众信息
   *
   * @param {FetchRecommendParams} params
   * @returns {Observable<Recommend[]>}
   * @memberof RecommendService
   */
  fetchRecommend(params: FetchRecommendParams): Observable<Recommend[]> {
    return this.tenantService
      .getTenantIdAndExhibitionId()
      .mergeMap(([tenantId, exhibitionId]) => {
        let query = `?exhibitorId=${exhibitionId}&itemId=${tenantId}`
        if (params.area) {
          query += `&province=${params.area}`
        }
        if (params.key) {
          query += `&search=${params.key}`
        }
        if (params.type) {
          query += `&objective=${params.type}`
        }
        if (params.pageIndex) {
          query += `&pageIndex=${params.pageIndex}`
        }
        if (params.pageSize) {
          query += `&pageSize=${params.pageSize}`
        }

        return this.http.get(
          this.fetchUrl + query
        )
      })
      .map(e => (e as APIResponse).result)
      .map(e => e.map(Recommend.convertFromResp))
      .catch(this.handleError)

    // return Observable.of(fakeRecommends)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
