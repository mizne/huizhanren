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
  name: `张${i}`,
  title: `经理${i}`,
  company: `移动公司${i}`,
  industry: i % 2 === 0 ? `互联网${i}` : '',
  area: `上海${i}`
}))

@Injectable()
export class RecommendService {
  private fetchUrl: string = '/data/RecVisInfo'

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
  public fetchRecommend(params: FetchRecommendParams): Observable<Recommend[]> {
    return environment.production
      ? this.tenantService
          .getExhibitorId()
          .mergeMap(exhibitorId => {
            let query = `?exhibitorId=${exhibitorId}`
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
