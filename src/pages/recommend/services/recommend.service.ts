import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import { Recommend, FetchRecommendParams } from '../models/recommend.model'

import { environment } from '../../../environments/environment'

const fakeRecommends: Recommend[] = Array.from({ length: 100 }, (_, i) => ({
  id: 'recommend-' + String(i),
  name: `testName${i}`,
  title: `testTitle${i}`,
  company: `testCompany${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`
}))

@Injectable()
export class RecommendService {
  private fetchUrl: string = '/data/VisiterInfo'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取推荐观众信息
   *
   * @param {FetchRecommendParams} params
   * @returns {Observable<Recommend[]>}
   * @memberof RecommendService
   */
  fetchRecommend(params: FetchRecommendParams): Observable<Recommend[]> {
    return environment.production
      ? this.tenantService
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

            return this.http.get(this.fetchUrl + query)
          })
          .map(e => (e as APIResponse).result)
          .map(e => e.map(Recommend.convertFromResp))
          .catch(e => {
            return this.logger.httpError({
              module: 'RecommendService',
              method: 'fetchRecommend',
              error: e
            })
          })
      : Observable.of(fakeRecommends)
  }
}
