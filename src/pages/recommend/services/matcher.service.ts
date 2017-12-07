import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import {
  Matcher,
  FetchMatcherParams,
  convertMatcherStatusFromModel
} from '../models/matcher.model'
import { Recommend } from '../models/recommend.model'

import { environment } from '../../../environments/environment'

const fakeMatchers: Matcher[] = Array.from({ length: 100 }, (_, i) => ({
  id: 'matcher-' + String(i),
  name: `testName${i}`,
  title: `testTitle${i}`,
  company: `testCompany${i}`,
  industry: `testIndustry${i}`,
  area: `testArea${i}`,
  status: i % 5,
  senderId: i % 2 === 0 ? '1aed77d156448e784da0affd6eda84e1' : '111',
  receiverId: i % 2 === 1 ? '1aed77d156448e784da0affd6eda84e1' : '222'
}))

@Injectable()
export class MatcherService {
  private fetchUrl: string = '/data/InvitationInfo'
  private insertUrl = '/data/insert/InvitationInfo'
  private updateUrl: string = '/data/update/InvitationInfo'

  constructor(private http: HttpClient, private tenantService: TenantService) {}

  /**
   * 获取 发出的或收到的约请记录
   *
   * @param {number} pageIndex
   * @param {number} pageSize
   * @returns {Observable<Matcher[]>}
   * @memberof MatcherService
   */
  fetchMatchers(params: FetchMatcherParams): Observable<Matcher[]> {
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserId()
          .mergeMap(([tenantId, userId]) => {
            let query = `?role=E&tenantId=${tenantId}`
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
          .map(e => e.map(Matcher.convertFromResp))
          .withLatestFrom(
            this.tenantService.getTenantId(),
            (matchers, tenantId) =>
              matchers.map(e => ({
                ...e,
                isSender: e.senderId === tenantId,
                isReceiver: e.receiverId === tenantId
              }))
          )
          .catch(this.handleError)
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
   * @param {Recommend} recommend
   * @param {string} boothArea
   * @param {string} tenantId
   * @param {string} customerId
   * @returns {Observable<any>}
   * @memberof MatcherService
   */
  createMatcher(
    recommend: Recommend,
    boothArea: string,
    tenantId: string,
    customerId: string
  ): Observable<any> {
    const params = Recommend.convertFromModel(recommend)
    Object.assign(params, {
      Place: boothArea,
      State: '未审核',
      Initator: tenantId,
      Receiver: customerId
    })

    return this.tenantService
      .getTenantIdAndUserIdAndCompanyName()
      .mergeMap(([tenantId, userId, companyName]) => {
        Object.assign(params, {
          ExhibitionName: companyName
        })
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
          params: {
            record: params
          }
        })
      })
      .catch(this.handleError)
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
      .catch(this.handleError)
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
      .catch(this.handleError)
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
      .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
