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

const fakeMatchers: VisitorMatcher[] = Array.from({ length: 100 }, (_, i) => ({
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
   * @returns {Observable<VisitorMatcher[]>}
   * @memberof MatcherService
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
   * 获取所有约请 条数
   *
   * @returns {Observable<number>}
   * @memberof VisitorMatcherService
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
    //               module: 'VisitorMatcherService',
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
      State: convertMatcherStatusFromModel(VisitorMatcherStatus.UN_AUDIT),
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
   * @memberof MatcherService
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
   * @memberof MatcherService
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
