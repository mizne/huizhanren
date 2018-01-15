import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  RecommendExhibitor,
  FetchRecommendExhibitorParams,
  ExhibitorFilter,
  FilterOptions
} from '../models/exhibitor.model'
import { environment } from '../../../environments/environment'

@Injectable()
export class ExhibitorService {
  private fetchUrl: string = '/data/get/exhibitor'
  private fetchCountUrl = '/data/get/exhibitor/count'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取推荐展商 分页请求
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Recommend[]>}
   * @memberof ExhibitorService
   */
  fetchExhibitors(
    params: FetchRecommendExhibitorParams
  ): Observable<RecommendExhibitor[]> {
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
              query += `&acreage=${params.type}`
            }
            if (params.pageIndex) {
              query += `&pageIndex=${params.pageIndex}`
            }
            if (params.pageSize) {
              query += `&pageSize=${params.pageSize}`
            }
            return this.http
              .get(this.fetchUrl + query)
              .map(e => (e as APIResponse).result)
              .map(e =>
                e
                  .filter(e => e.TenantId !== tenantId)
                  .map(RecommendExhibitor.convertFromResp)
              )
              .catch(e => {
                return this.logger.httpError({
                  module: 'ExhibitorService',
                  method: 'fetchExhibitors',
                  error: e
                })
              })
          })
      : Observable.of(
          RecommendExhibitor.generateFakeExhibitors(
            (params.pageIndex - 1) * params.pageSize,
            params.pageIndex * params.pageSize
          )
        ).delay(Math.random() * 1e3)
  }

  /**
   * 获取所有展商 个数
   *
   * @returns {Observable<number>}
   * @memberof ExhibitorService
   */
  fetchExhibitorsCount(params: ExhibitorFilter): Observable<number> {
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
              query += `&acreage=${params.type}`
            }
            return this.http
              .get(this.fetchCountUrl + query)
              .map(e => (e as APIResponse).result)
              .catch(e => {
                return this.logger.httpError({
                  module: 'ExhibitorService',
                  method: 'fetchExhibitorsCount',
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
      {
        label: '不限面积',
        value: ''
      },
      {
        label: '9-18平米',
        value: '1'
      },
      {
        label: '18-27平米',
        value: '2'
      },
      {
        label: '27-54平米',
        value: '3'
      },
      {
        label: '>54平米',
        value: '4'
      }
    ])
  }
}
