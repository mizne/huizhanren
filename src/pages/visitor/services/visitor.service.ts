import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  RecommendVisitor,
  FetchRecommendVisitorParams,
  VisitorFilter,
} from '../models/visitor.model'

import { environment } from '../../../environments/environment'

const fakeRecommendVisitors: RecommendVisitor[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: 'recommend-' + String(i),
    name: `张${i}`,
    title: `经理${i}`,
    company: `移动公司${i}`,
    industry: i % 2 === 0 ? `互联网${i}` : '',
    area: `上海${i}`
  })
)

@Injectable()
export class VisitorService {
  private fetchUrl: string = '/data/RecVisInfo'
  private fetchCountUrl = '/data/RecVisInfo/count'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取推荐观众信息
   *
   * @param {FetchRecommendVisitorParams} params
   * @returns {Observable<RecommendVisitor[]>}
   * @memberof VisitorService
   */
  public fetchVisitors(
    params: FetchRecommendVisitorParams
  ): Observable<RecommendVisitor[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([_, __, exhibitorId, exhibitionId]) => {
            let query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`
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
          .map(e => e.map(RecommendVisitor.convertFromResp))
          .catch(e => {
            return this.logger.httpError({
              module: 'VisitorService',
              method: 'fetchVisitors',
              error: e
            })
          })
      : Observable.of(fakeRecommendVisitors)
  }
  /**
   * 获取所有观众 个数
   *
   * @returns {Observable<number>}
   * @memberof VisitorService
   */
  fetchVisitorCount(params: VisitorFilter): Observable<number> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, _, exhibitorId, exhibitionId]) => {
            let query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`
            if (params.area) {
              query += `&province=${params.area}`
            }
            if (params.key) {
              query += `&search=${params.key}`
            }
            if (params.type) {
              query += `&objective=${params.type}`
            }
            return this.http
              .get(this.fetchCountUrl + query)
              .map(e => (e as APIResponse).result)
              .catch(e => {
                return this.logger.httpError({
                  module: 'VisitorService',
                  method: 'fetchVisitorCount',
                  error: e
                })
              })
          })
      : Observable.of(1000)
  }
}
