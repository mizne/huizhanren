import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

import { ExhibitorMatcher } from '../models/matcher.model'
import { RecommendExhibitor } from '../models/exhibitor.model'

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
    ]
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
    pageIndex: number,
    pageSize: number
  ): Observable<ExhibitorMatcher[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            return this.http.get(
              this.fetchUrl +
                `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}&pageIndex=${pageIndex}&pageSize=${pageSize}`
            )
          })
          .map(e => (e as APIResponse).result)
          .map(e => e.map(ExhibitorMatcher.convertFromResp))
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
    const params = RecommendExhibitor.convertFromModel(exhibitor)
    Object.assign(params, {
      State: '1',
      Type: '1',
      Initator: tenantId,
      Receiver: exhibitor.id
    })

    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
        Object.assign(params, {
          ContactExhibitionReceiver: exhibitor.recordId,
          ContactExhibitionInitator: exhibitionId
        })
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
          params: {
            record: params
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
          State: '已取消'
        }
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl + `/${matcherId}/${tenantId}/${userId}`,
          params
        )
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
          State: '已同意'
        }
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl + `/${matcherId}/${tenantId}/${userId}`,
          params
        )
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
          State: '已拒绝'
        }
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl + `/${matcherId}/${tenantId}/${userId}`,
          params
        )
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
