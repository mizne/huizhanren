import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { RecommendExhibitor } from '../models/exhibitor.model'

import { environment } from '../../../environments/environment'

const fakeExhibitors: RecommendExhibitor[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: String(i),
    name: `testName${i}`,
    logo: './assets/images/card.jpg',
    booth: `testBooth${i}`,
    industry: `testIndustry${i}`,
    area: `testArea${i}`,
    heat: Math.round(Math.random() * 1000),
    description:
      '上海联展软件技术有限公司是会展互联网、信息化及营销解决方案的领先服务商' +
      '。成立于2004年，总部位于上海，在长沙、广州等设有分支或代理机构。',
    products: [
      {
        id: '0',
        name: 'product1',
      }
    ]
  })
)

@Injectable()
export class ExhibitorService {
  private fetchUrl: string = '/data/ExhibitionInfo'
  private inviteUrl: string = '/data/insert/User'

  constructor(private http: HttpClient, private tenantService: TenantService) {}

  /**
   * 获取推荐展商 分页请求
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Recommend[]>}
   * @memberof RecommendService
   */
  fetchExhibitors(
    pageIndex: number,
    pageSize: number
  ): Observable<RecommendExhibitor[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndItemName()
          .mergeMap(([tenantId, itemName]) => {
            let query = `?itemName=${itemName}`
            return this.http
              .get(this.fetchUrl + query)
              .map(e => (e as APIResponse).result)
              .map(e => e.filter(e => e.TenantId !== tenantId).map(RecommendExhibitor.convertFromResp))
              .catch(this.handleError)
          })
      : Observable.of(fakeExhibitors)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
