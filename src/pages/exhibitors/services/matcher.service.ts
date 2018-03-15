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
  FetchMatcherParams,
  ExhibitorMatcherDirection
} from '../models/matcher.model'
import { Exhibitor } from '../models/exhibitor.model'
import { environment } from '../../../environments/environment'
import { ToDoFilterOptions } from '../components/matcher-filter/matcher-filter.component'

@Injectable()
export class ExhibitorMatcherService {
  private fetchUrl: string = '/data/queryList/InvitationInfoExhi'
  private fetchCountUrl = '/data/queryCount/InvitationInfoExhi'
  private insertUrl = '/data/insert/InvitationInfoExhi'
  private updateUrl: string = '/data/update/InvitationInfoExhi'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取 发出的或收到的约请记录
   *
   * @param {FetchMatcherParams} params
   * @returns {Observable<ExhibitorMatcher[]>}
   * @memberof ExhibitorMatcherService
   */
  fetchMatchers(params: FetchMatcherParams): Observable<ExhibitorMatcher[]> {
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
              if (params.statuses[0] === ExhibitorMatcherStatus.ANY) {
                condition.State = {
                  $in: [
                    ExhibitorMatcherStatus.UN_AUDIT,
                    ExhibitorMatcherStatus.AUDIT_SUCCEED
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
                case ExhibitorMatcherDirection.FROM_ME:
                  condition.Initator = exhibitorId
                  break
                case ExhibitorMatcherDirection.TO_ME:
                  condition.Receiver = exhibitorId
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
          .map(e => (e as APIResponse).result as ExhibitorMatcherResp[])
          .map(e => e.map(ExhibitorMatcher.convertFromResp))
          .withLatestFrom(
            this.tenantService.getExhibitorId(),
            (results, exhibitorId) => {
              return results.map(e => ({
                ...e,
                toShow: ExhibitorMatcher.extractExhibitorToShow(e, exhibitorId),
                isInitator: e.initator.id === exhibitorId,
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
      : Observable.of(
          ExhibitorMatcher.generateFakeMatchers(
            (params.pageIndex - 1) * params.pageSize,
            params.pageIndex * params.pageSize
          )
        ).delay(Math.random() * 1e3)
  }

  /**
   * 获取所有约请条数
   *
   * @returns {Observable<number>}
   * @memberof ExhibitorMatcherService
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
              if (params.status === ExhibitorMatcherStatus.ANY) {
                condition.State = {
                  $in: [
                    ExhibitorMatcherStatus.UN_AUDIT,
                    ExhibitorMatcherStatus.AUDIT_SUCCEED
                  ].map(convertMatcherStatusFromModel)
                }
              } else {
                condition.State = convertMatcherStatusFromModel(params.status)
              }
            }
            if (params.direction) {
              switch (params.direction) {
                case ExhibitorMatcherDirection.FROM_ME:
                  condition.Initator = exhibitorId
                  break
                case ExhibitorMatcherDirection.TO_ME:
                  condition.Receiver = exhibitorId
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
                  module: 'ExhibitorMatcherService',
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
   * @param {string} receiverId
   * @returns {Observable<any>}
   * @memberof ExhibitorMatcherService
   */
  createMatcher(receiverId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, exhibitorId, exhibitionId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              State: convertMatcherStatusFromModel(
                ExhibitorMatcherStatus.UN_AUDIT
              ),
              Type: '1',
              Initator: exhibitorId,
              Receiver: receiverId,
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
   * @memberof ExhibitorMatcherService
   */
  cancelMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.CANCEL)
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
   * @memberof ExhibitorMatcherService
   */
  agreeMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.AGREE)
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
          module: 'ExhibitorMatcherService',
          method: 'agreeMatcher',
          error: e
        })
      })
  }

  public batchAgreeMatcher(matcherIds: string[]): Observable<any> {
    const params = {
      params: matcherIds.map(id => ({
        recordId: id,
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.AGREE)
        }
      }))
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
          module: 'ExhibitorMatcherService',
          method: 'batchAgreeMatcher',
          error: e
        })
      })
  }

  /**
   * 拒绝约请
   *
   * @param {string} matcherId
   * @returns {Observable<any>}
   * @memberof ExhibitorMatcherService
   */
  refuseMatcher(matcherId: string): Observable<any> {
    const params = {
      params: {
        setValue: {
          State: convertMatcherStatusFromModel(ExhibitorMatcherStatus.REFUSE)
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
          module: 'ExhibitorMatcherService',
          method: 'refuseMatcher',
          error: e
        })
      })
  }
}
