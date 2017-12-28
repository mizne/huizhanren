import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  Matcher,
  FetchMatcherParams,
  convertMatcherStatusFromModel
} from '../models/matcher.model'
import { Visitor } from '../models/visitor.model'

import { environment } from '../../../environments/environment'

const fakeMatchers: Matcher[] = Array.from({ length: 100 }, (_, i) => ({
  id: 'matcher-' + String(i),
  name: `李${i}`,
  title: `经理${i}`,
  company: `移动公司${i}`,
  industry: `互联网${i}`,
  area: `北京${i}`,
  status: i % 5,
  senderId: i % 2 === 0 ? '1aed77d156448e784da0affd6eda84e1' : '111',
  receiverId: i % 2 === 1 ? '1aed77d156448e784da0affd6eda84e1' : '222'
}))

@Injectable()
export class VisitorMatcherService {
  private fetchUrl: string = '/data/get/invitationInfo'
  private insertUrl = '/sys/insert/InvitationInfo'
  private updateUrl: string = '/data/update/inviinfo'

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
   * @returns {Observable<Matcher[]>}
   * @memberof MatcherService
   */
  public fetchMatchers(params: FetchMatcherParams): Observable<Matcher[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([_, __, exhibitorId, exhibitionId]) => {
            let query = `?exhibitionId=${exhibitionId}&exhibitorId=${exhibitorId}`
            if (params.pageIndex) {
              query += `&pageIndex=${params.pageIndex}`
            }
            if (params.pageSize) {
              query += `&pageSize=${params.pageSize}`
            }
            if (params.statuses) {
              query += `&state=${params.statuses.map(
                convertMatcherStatusFromModel
              )}`
            }
            return this.http.get(this.fetchUrl + query)
          })
          .map(e => (e as APIResponse).result)
          .map(e =>
            e.filter(f => f.State !== '5').map(Matcher.convertFromResp)
          )
          .withLatestFrom(
            this.tenantService.getTenantId(),
            (matchers, tenantId) =>
              matchers.map(e => ({
                ...e,
                isSender: e.type === '1',
                isReceiver: e.type === '0'
              }))
          )
          .catch(e => {
            return this.logger.httpError({
              module: 'VisitorMatcherService',
              method: 'fetchMatchers',
              error: e
            })
          })
      : Observable.of(fakeMatchers).withLatestFrom(
          this.tenantService.getTenantId(),
          (matchers, tenantId) =>
            matchers.map(e => ({
              ...e,
              isSender: e.senderId === tenantId,
              isReceiver: e.receiverId === tenantId
            }))
        )
  }
  /**
   * 新建约请
   *
   * @param {Visitor} recommend
   * @param {string} boothArea
   * @param {string} tenantId
   * @param {string} customerId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  public createMatcher(
    recommend: Visitor,
    boothArea: string,
    tenantId: string,
    customerId: string
  ): Observable<any> {
    // const params = Recommend.convertFromModel(recommend)
    // Object.assign(params, {
    //   Place: boothArea,
    //   State: '未审核',
    //   Initator: tenantId,
    //   Receiver: customerId
    // })
    const params = {
      State: '2',
      Type: '1', // 约请的发起方向
      Receiver: customerId
    }

    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
        Object.assign(params, {
          ExhibitionId: exhibitionId,
          Initator: exhibitorId
        })
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
          params: {
            records: params
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'VisitorMatcherService',
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
  public cancelMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: '5'
        },
        InvitationInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([_, __]) => {
        return this.http.put(this.updateUrl, params)
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'VisitorMatcherService',
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
  public agreeMatcher(matcherId: string): Observable<any> {
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
          module: 'VisitorMatcherService',
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
  public refuseMatcher(matcherId: string): Observable<any> {
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
          module: 'VisitorMatcherService',
          method: 'refuseMatcher',
          error: e
        })
      })
  }
}
