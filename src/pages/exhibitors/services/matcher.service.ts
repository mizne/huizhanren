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
import { RecommendExhibitor } from '../models/exhibitor.model'
import { environment } from '../../../environments/environment'

@Injectable()
export class ExhibitorMatcherService {
  private fetchUrl: string = '/data/get/ExhibitionInvitationInfo'
  private fetchCountUrl = '/data/get/ExhibitionInvitationInf/count'
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
  fetchMatchers(params: FetchMatcherParams): Observable<ExhibitorMatcher[]> {
    return this.tenantService
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
        return this.http.get(this.fetchUrl + query)
      })
      .map(e => (e as APIResponse).result as ExhibitorMatcherResp[])
      .map(e =>
        e
          .filter(f => f.State !== '5' && f.State !== '6')
          .filter(
            f =>
              f.Initator &&
              f.Initator.length > 0 &&
              f.Receiver &&
              f.Receiver.length > 0
          )
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
  }

  /**
   * 获取所有约请条数
   *
   * @returns {Observable<number>}
   * @memberof ExhibitorMatcherService
   */
  fetchMatcherCount(statuses: ExhibitorMatcherStatus[]): Observable<number> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
          .mergeMap(([tenantId, _, exhibitorId, exhibitionId]) => {
            let query = `?exhibitorId=${exhibitorId}&exhibitionId=${exhibitionId}`
            if (statuses && statuses.length > 0) {
              query += `&state=${statuses.map(convertMatcherStatusFromModel)}`
            }
            return this.http
              .get(this.fetchCountUrl + query)
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
