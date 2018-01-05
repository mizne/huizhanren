import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import {
  VisitorMatcher,
  VisitorMatcherStatus,
  FetchMatcherParams,
  convertMatcherStatusFromModel,
  VisitorMatcherResp
} from '../models/matcher.model'
import { Visitor } from '../models/visitor.model'
import { environment } from '../../../environments/environment'

@Injectable()
export class VisitorMatcherService {
  private fetchUrl: string = '/data/get/invitationInfo'
  private fetchCountUrl = '/data/get/invitationInfo/count'
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
   * @param {FetchMatcherParams} params
   * @returns {Observable<VisitorMatcher[]>}
   * @memberof VisitorMatcherService
   */
  public fetchMatchers(
    params: FetchMatcherParams
  ): Observable<VisitorMatcher[]> {
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
            if (params.statuses && params.statuses.length > 0) {
              query += `&state=${params.statuses.map(
                convertMatcherStatusFromModel
              )}`
            }
            return this.http.get(this.fetchUrl + query)
          })
          .map(e => (e as APIResponse).result as VisitorMatcherResp[])
          .map(e =>
            e.filter(f => f.State !== '5' && f.State !== '6')
            .filter(f => f.Initator && f.Initator.length > 0 && f.Receiver && f.Receiver.length > 0)
            .map(VisitorMatcher.convertFromResp)
          )
          .withLatestFrom(
            this.tenantService.getExhibitorId(),
            (matchers, exhibitorId) =>
              matchers.map(e => ({
                ...e,
                ...VisitorMatcher.extractVisitorToShow(e, exhibitorId),
                isSender: e.sender.id === exhibitorId,
                isReceiver: e.receiver.id === exhibitorId
              }))
          )
          .catch(e => {
            return this.logger.httpError({
              module: 'VisitorMatcherService',
              method: 'fetchMatchers',
              error: e
            })
          })
      : Observable.of(VisitorMatcher.generateFakeMatchers(
        (params.pageIndex - 1) * params.pageSize,
        params.pageIndex * params.pageSize
      )).delay(Math.random() * 1e3)
  }

  /**
   * 获取所有约请 条数
   *
   * @param {VisitorMatcherStatus[]} statuses
   * @returns {Observable<number>}
   * @memberof VisitorMatcherService
   */
  fetchMatcherCount(statuses: VisitorMatcherStatus[]): Observable<number> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([_, __, exhibitorId, exhibitionId]) => {
            let query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`
            if (statuses && statuses.length > 0) {
              query += `&state=${statuses.map(
                convertMatcherStatusFromModel
              )}`
            }
            return this.http
              .get(this.fetchCountUrl + query)
              .map(e => (e as APIResponse).result)
              .catch(e => {
                return this.logger.httpError({
                  module: 'VisitorMatcherService',
                  method: 'fetchMatcherCount',
                  error: e
                })
              })
          })
      : Observable.of(1000)
  }

  /**
   * 新建约请
   *
   * @param {string} visitorId
   * @returns {Observable<any>}
   * @memberof VisitorMatcherService
   */
  public createMatcher(
    visitorId: string
  ): Observable<any> {
    const params = {
      State: convertMatcherStatusFromModel(VisitorMatcherStatus.UN_AUDIT),
      Type: '1', // 约请的发起方向
      Receiver: visitorId
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
   * @memberof VisitorMatcherService
   */
  public cancelMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(VisitorMatcherStatus.CANCEL)
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
   * @memberof VisitorMatcherService
   */
  public agreeMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(VisitorMatcherStatus.AGREE)
        },
        InvitationInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.put(this.updateUrl, params)
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
   * @memberof VisitorMatcherService
   */
  public refuseMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(VisitorMatcherStatus.REFUSE)
        },
        InvitationInfoId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.put(this.updateUrl, params)
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
