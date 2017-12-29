import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  RecommendExhibitor,
  FetchRecommendExhibitorParams
} from '../models/exhibitor.model'

import { environment } from '../../../environments/environment'

const fakeExhibitors: RecommendExhibitor[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: String(i),
    name: `展商特别长特别长特别长的名字${i}`,
    logo: './assets/images/card.jpg',
    booth: Math.random() > 0.5 ? `0-2AAA${i}` : '',
    industry: Math.random() > 0.5 ? `大数据${i}` : '',
    area: Math.random() > 0.5 ? `东京${i}` : '',
    heat: Math.round(Math.random() * 1000),
    description:
      Math.random() > 0.5
        ? '上海联展软件技术有限公司是会展互联网、信息化及营销解决方案的领先服务商' +
          '。成立于2004年，总部位于上海，在长沙、广州等设有分支或代理机构。'
        : '',
    products:
      Math.random() > 0.5
        ? Array.from({ length: 100 }, (_, i) => ({
            id: String(i),
            name: 'product1product1product1product1product1product1',
            pictures: ['./assets/images/camera.jpg']
          }))
        : [],
    visitors:
      Math.random() > 0.5
        ? Array.from({ length: 30 }, (_, i) => ({
            id: String(i),
            headImgUrl: './assets/images/camera.jpg'
          }))
        : []
  })
)

@Injectable()
export class ExhibitorService {
  private fetchUrl: string = '/data/get/exhibitor'

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
   * @memberof RecommendService
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
            if (params.acreage) {
              query += `&objective=${params.acreage}`
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
      : Observable.of(fakeExhibitors)
  }

  /**
   * 获取所有展商 个数
   *
   * @returns {Observable<number>}
   * @memberof ExhibitorService
   */
  fetchExhibitorsCount(): Observable<number> {
    // return environment.production
    //   ? this.tenantService
    //       .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
    //       .mergeMap(([tenantId, _, exhibitorId, exhibitionId]) => {
    //         const query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`
    //         return this.http
    //           .get(this.fetchUrl + query)
    //           .map(e => (e as APIResponse).result)
    //           .map(e => e[0])
    //           .catch(e => {
    //             return this.logger.httpError({
    //               module: 'ExhibitorService',
    //               method: 'fetchExhibitorsCount',
    //               error: e
    //             })
    //           })
    //       })
    //   : Observable.of(1)

    return Observable.of(1000)
  }
}
