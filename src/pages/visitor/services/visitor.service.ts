import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  RecommendVisitor,
  FetchRecommendVisitorParams,
  VisitorFilter
} from '../models/visitor.model'
import { environment } from '../../../environments/environment'

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
      : Observable.of(
          RecommendVisitor.generateFakeVisitors(
            (params.pageIndex - 1) * params.pageSize,
            params.pageIndex * params.pageSize
          )
        ).delay(Math.random() * 1e3)
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
