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
  VisitorMatcherResp,
  VisitorMatcherDirection
} from '../models/matcher.model'
import { Visitor } from '../models/visitor.model'
import { environment } from '../../../environments/environment'
import { ToDoFilterOptions } from '../components/matcher-filter/matcher-filter.component'

@Injectable()
export class VisitorMatcherService {
  private fetchUrl: string = '/data/queryList/InvitationInfo'
  private fetchCountUrl = '/data/queryCount/InvitationInfo'
  private insertUrl = '/data/insert/InvitationInfo'
  private updateUrl: string = '/data/update/InvitationInfo'

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
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            const condition: { [key: string]: any } = {
              ExhibitionId: exhibitionId,
              ExhibitorId: exhibitorId
            }
            const options: { [key: string]: number } = {}

            if (params.pageIndex) {
              options.pageIndex = params.pageIndex
            }
            if (params.pageSize) {
              options.pageSize = params.pageSize
            }
            if (params.statuses && params.statuses.length > 0) {
              if (params.statuses[0] === VisitorMatcherStatus.ANY) {
                condition.State = {
                  $in: [
                    VisitorMatcherStatus.UN_AUDIT,
                    VisitorMatcherStatus.AUDIT_SUCCEED
                  ].map(convertMatcherStatusFromModel)
                }
              } else {
                condition.State = convertMatcherStatusFromModel(
                  params.statuses[0]
                )
              }
            }
            if (typeof params.direction !== 'undefined') {
              switch (params.direction) {
                case VisitorMatcherDirection.FROM_ME:
                  condition.initator = exhibitorId
                  break
                case VisitorMatcherDirection.TO_ME:
                  condition.receiver = exhibitorId
                  break
              }
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
          .map(e => (e as APIResponse).result as VisitorMatcherResp[])
          .map(e => {
            return e.map(VisitorMatcher.convertFromResp)
          })
          .withLatestFrom(
            this.tenantService.getExhibitorId(),
            (matchers, exhibitorId) =>
              matchers.map(e => ({
                ...e,
                toShow: VisitorMatcher.extractVisitorToShow(e, exhibitorId),
                isSender: e.initator.id === exhibitorId,
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
      : Observable.of(
          VisitorMatcher.generateFakeMatchers(
            (params.pageIndex - 1) * params.pageSize,
            params.pageIndex * params.pageSize
          )
        ).delay(Math.random() * 1e3)
  }

  /**
   * 获取所有约请 条数
   *
   * @param {ToDoFilterOptions[]}
   * @returns {Observable<number>}
   * @memberof VisitorMatcherService
   */
  fetchMatcherCount(params: ToDoFilterOptions): Observable<number> {
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
            const condition: { [key: string]: any } = {
              ExhibitionId: exhibitionId,
              ExhibitorId: exhibitorId
            }

            if (params.status) {
              if (params.status === VisitorMatcherStatus.ANY) {
                condition.State = {
                  $in: [
                    VisitorMatcherStatus.UN_AUDIT,
                    VisitorMatcherStatus.AUDIT_SUCCEED
                  ].map(convertMatcherStatusFromModel)
                }
              } else {
                condition.State = convertMatcherStatusFromModel(params.status)
              }
            }
            if (params.direction) {
              switch (params.direction) {
                case VisitorMatcherDirection.FROM_ME:
                  condition.initator = exhibitorId
                  break
                case VisitorMatcherDirection.TO_ME:
                  condition.receiver = exhibitorId
                  break
              }
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
  public createMatcher(visitorId: string): Observable<any> {
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
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: Object.assign(params, {
              ExhibitionId: exhibitionId,
              Initator: exhibitorId
            })
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
        recordId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl,
          Object.assign(
            {
              tenantId,
              userId
            },
            params
          )
        )
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
        recordId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl,
          Object.assign(
            {
              tenantId,
              userId
            },
            params
          )
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
   * @memberof VisitorMatcherService
   */
  public refuseMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(VisitorMatcherStatus.REFUSE)
        },
        recordId: matcherId
      }
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl,
          Object.assign(
            {
              tenantId,
              userId
            },
            params
          )
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
