import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  Exhibitor,
  FetchRecommendExhibitorParams,
  ExhibitorFilter,
  FilterOptions
} from '../models/exhibitor.model'
import { environment } from '../../../environments/environment'

@Injectable()
export class ExhibitorService {
  private fetchUrl: string = '/data/queryList/Exhibitor'
  private fetchCountUrl = '/data/queryCount/Exhibitor'

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
  ): Observable<Exhibitor[]> {
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            const condition: { [key: string]: string } = {
              ExhibitionId: exhibitionId,
              ExhibitorId: exhibitorId
            }
            const options: { [key: string]: number } = {}
            if (params.area) {
              condition.Province = params.area
            }
            if (params.key) {
              condition.CompanyName = `/${params.key}/`
            }
            if (params.type) {
              condition.ShowArea = params.type
            }

            if (params.pageIndex) {
              options.pageIndex = params.pageIndex
            }
            if (params.pageSize) {
              options.pageSize = params.pageSize
            }

            return this.http
              .post(this.fetchUrl, {
                tenantId,
                userId,
                params: {
                  condition,
                  options
                }
              })
              .map(e => (e as APIResponse).result)
              .map(e =>
                e
                  .filter(e => e.TenantId !== tenantId)
                  .map(Exhibitor.convertFromResp)
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
          Exhibitor.generateFakeExhibitors(
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
              condition.CompanyName = `/${params.key}/`
            }
            if (params.type) {
              condition.ShowArea = params.type
            }

            return this.http
              .post(this.fetchCountUrl, {
                tenantId,
                userId,
                params: {
                  condition
                }
              })
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
