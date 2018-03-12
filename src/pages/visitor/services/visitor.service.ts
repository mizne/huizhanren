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
  FilterOptions
} from '../models/visitor.model'
import { environment } from '../../../environments/environment'

@Injectable()
export class VisitorService {
  private fetchUrl: string = '/data/get/recvisitor'
  private fetchCountUrl = '/data/queryCount/Visitor'

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
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            const condition: { [key: string]: string } = {
              ExhibitionId: exhibitionId
            }
            const options: { [key: string]: number } = {}
            if (params.area) {
              condition.Province = params.area
            }
            if (params.key) {
              condition.Name = `/${params.key}/`
            }
            if (params.type) {
              condition.Objective = params.type
            }
            if (params.pageIndex) {
              options.pageIndex = params.pageIndex
            }
            if (params.pageSize) {
              options.pageSize = params.pageSize
            }

            return this.http.post(this.fetchUrl, {
              tenantId,
              userId,
              params: {
                condition,
                options
              }
            })
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
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            const condition: { [key: string]: string } = {}
            const options: { [key: string]: number } = {}
            if (params.area) {
              condition.Province = params.area
            }
            if (params.key) {
              condition.Name = `/${params.key}/`
            }
            if (params.type) {
              condition.Objective = params.type
            }

            return this.http
              .post(this.fetchCountUrl, {
                tenantId,
                userId,
                params: {
                  ExhibitionId: exhibitionId,
                  condition
                }
              })
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

  fetchAreaFilters(): Observable<FilterOptions[]> {
    return Observable.of([
      { label: '不限区域', value: '' },
      {
        label: '北京市',
        value: '北京市'
      },
      {
        label: '天津市',
        value: '天津市'
      },
      {
        label: '上海市',
        value: '上海市'
      },
      {
        label: '江苏省',
        value: '江苏省'
      },
      {
        label: '浙江省',
        value: '浙江省'
      },
      {
        label: '山东省',
        value: '山东省'
      },
      {
        label: '湖北省',
        value: '湖北省'
      },
      {
        label: '安徽省',
        value: '安徽省'
      }
    ])
  }

  fetchTypeFilters(): Observable<FilterOptions[]> {
    return Observable.of([
      { label: '不限分类', value: '' },
      {
        label: '糖酒',
        value: '糖酒'
      },
      {
        label: '餐饮食材',
        value: '餐饮食材'
      },
      {
        label: '酒店用品',
        value: '酒店用品'
      },
      {
        label: '食品机械',
        value: '食品机械'
      }
    ])
  }
}
