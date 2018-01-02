import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

import {
  ExhibitorMatcher,
  ExhibitorMatcherStatus,
  convertMatcherStatusFromModel,
  ExhibitorMatcherResp,
  FetchMatcherParams
} from '../models/matcher.model'
import { RecommendExhibitor, } from '../models/exhibitor.model'

import { environment } from '../../../environments/environment'

const fakeMatchers: ExhibitorMatcher[] = Array.from(
  { length: 100 },
  (_, i) => ({
    id: String(i),
    name: `展商${i}`,
    logo: './assets/images/card.jpg',
    title: `经理${i}`,
    booth: `0-2AAA${i}`,
    company: `移动公司${i}`,
    industry: `大数据${i}`,
    area: `东京${i}`,
    status: i % 5,
    senderId: i % 2 === 0 ? '1aed77d156448e784da0affd6eda84e1' : '111',
    receiverId: i % 2 === 1 ? '1aed77d156448e784da0affd6eda84e1' : '222',
    products: [
      // {
      //   id: '0',
      //   name: 'product1',
      // }
    ],
    visitors: []
  })
)

@Injectable()
export class ExhibitorMatcherService {
  private fetchUrl: string = '/data/get/ExhibitionInvitationInfo'
  private insertUrl = '/sys/insert/ExhibitionInvitationInfo'
  private updateUrl: string = '/data/update/exhiinviinfo'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取 发出的或收到的约请记录
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<ExhibitorMatcher[]>}
   * @memberof MatcherService
   */
  fetchMatchers(
    params: FetchMatcherParams
  ): Observable<ExhibitorMatcher[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            let query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`

            if (params.pageIndex) {
              query += `&pageIndex=${params.pageIndex}`
            }
            if (params.pageSize) {
              query += `&pageSize=${params.pageSize}`
            }
            if (params.statuses && params.statuses.length > 0) {
              query += `&state=${params.statuses.map(
                convertMatcherStatusFromModel
              )}`
            }

            return this.http.get(
              this.fetchUrl + query)
          })
          .map(e => (e as APIResponse).result as ExhibitorMatcherResp[])
          .map(e =>
            e.filter(f => f.State !== '5')
            .filter(f => f.Initator && f.Initator.length > 0 && f.Receiver && f.Receiver.length > 0)
            .map(ExhibitorMatcher.convertFromResp)
          )
          .withLatestFrom(
            this.tenantService.getExhibitorId(),
            (results, exhibitorId) => {
              return results.map(e => ({
                ...e,
                ...ExhibitorMatcher.extractExhibitorToShow(e, exhibitorId),
                isSender: e.sender.id === exhibitorId,
                isReceiver: e.receiver.id === exhibitorId
              }))
            }
          )
          .catch(e => {
            return this.logger.httpError({
              module: 'ExhibitorMatcherService',
              method: 'fetchMatchers',
              error: e
            })
          })
      : Observable.of(fakeMatchers).withLatestFrom(
          this.tenantService.getExhibitorId(),
          (matchers, exhibitorId) =>
            matchers.map(e => ({
              ...e,
              isSender: e.senderId === exhibitorId,
              isReceiver: e.receiverId === exhibitorId
            }))
        )
  }

  /**
   * 获取所有约请条数
   *
   * @returns {Observable<number>}
   * @memberof ExhibitorMatcherService
   */
  fetchMatcherCount(): Observable<number> {
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
    //               module: 'ExhibitorMatcherService',
    //               method: 'fetchMatcherCount',
    //               error: e
    //             })
    //           })
    //       })
    //   : Observable.of(1)
    return Observable.of(1000)
  }

  /**
   * 新建约请
   *
   * @param {RecommendExhibitor} exhibitor
   * @param {string} boothNo
   * @param {string} tenantId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  createMatcher(
    exhibitor: RecommendExhibitor,
    boothNo: string,
    tenantId: string
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
          params: {
            records: {
              State: convertMatcherStatusFromModel(
                ExhibitorMatcherStatus.UN_AUDIT
              ),
              Type: '1',
              Initator: exhibitorId,
              Receiver: exhibitor.id,
              ExhibitionId: exhibitionId
            }
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'ExhibitorMatcherService',
          method: 'createMatcher',
          error: e
        })
      })
  }

  /**
   * 取消约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  cancelMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.CANCEL)
        },
        ExhiInvInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.put(this.updateUrl, params)
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'ExhibitorMatcherService',
          method: 'cancelMatcher',
          error: e
        })
      })
  }

  /**
   * 同意约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  agreeMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.AGREE)
        },
        ExhiInvInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.put(this.updateUrl, params)
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'ExhibitorMatcherService',
          method: 'agreeMatcher',
          error: e
        })
      })
  }

  /**
   * 拒绝约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  refuseMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.REFUSE)
        },
        ExhiInvInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.put(this.updateUrl, params)
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'ExhibitorMatcherService',
          method: 'refuseMatcher',
          error: e
        })
      })
  }
}
