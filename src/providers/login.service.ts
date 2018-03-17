import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { Exhibition } from '../pages/login/models/exhibition.model'
import { APIResponse } from './interceptor'
import { ErrorLoggerService } from './error-logger.service'

export interface FetchExhibitionsAndLoginResp extends LoginResp {
  exhibitions: Exhibition[]
}

export interface LoginResp {
  adminName: string
  userName: string
  tenantId: string
  userId: string
  exhibitorId: string
  companyName: string
  boothNo: string
  exhibitionIds: string[]
}

export interface ExhibitorContact {
  Name: string
  Phone: string
  isAdmin: number
}

/*
  Generated class for the OcrServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginService {
  private exhibitionsUrl = '/data/queryList/Exhibition'
  private queryExhibitorContact = '/data/queryList/ExhibitorContact'
  private loginUrl = '/data/boxLogin'

  /**
   * 最大 http请求错误 重试次数
   *
   * @private
   * @type {number}
   * @memberof LoginService
   */
  private MAX_RETRY_COUNT: number = 3

  /**
   * http请求错误 重试间隔时间
   *
   * @private
   * @type {number}
   * @memberof LoginService
   */
  private RETRY_DELAY: number = 5e2

  constructor(public http: HttpClient, private logger: ErrorLoggerService) {}

  /**
   * 调用获取Exhibitions接口获取 所有会展信息
   * 调用登录接口去获取 管理员、用户名
   *
   * @param {any} phone
   * @returns {Observable<FetchExhibitionsAndLoginResp>}
   * @memberof LoginService
   */
  fetchExhibitionsAndLogin(phone): Observable<FetchExhibitionsAndLoginResp> {
    return this.login(phone)
      .mergeMap(loginResp => {
        return this.fetchExhibitions(loginResp.exhibitionIds).map(
          exhibitions => {
            return {
              adminName: loginResp.adminName,
              userName: loginResp.userName,
              tenantId: loginResp.tenantId,
              userId: loginResp.userId,
              exhibitorId: loginResp.exhibitorId,
              companyName: loginResp.companyName,
              boothNo: loginResp.boothNo,
              exhibitions: exhibitions
            }
          }
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'LoginService',
          method: 'fetchExhibitionsAndLogin',
          error: e
        })
      })
  }

  /**
   * 获取所有展会信息
   *
   * @private
   * @param {any} ids
   * @returns {Observable<any[]>}
   * @memberof LoginService
   */
  private fetchExhibitions(ids: string[]): Observable<Exhibition[]> {
    return this.http
      .post(this.exhibitionsUrl, {
        params: {
          recordIdList: ids
        }
      })
      .map(res => {
        const results = (res as APIResponse).result
        if (results.length === 0) {
          throw new Error('没有查询到会展信息')
        }
        return results.map(e => ({
          id: e.RecordId,
          name: e.ExName,
          startTime: e.StartTime,
          endTime: e.EndTime
        }))
      })
      .pipe(retry(this.MAX_RETRY_COUNT, this.RETRY_DELAY))
  }

  /**
   * 录
   *
   * @private
   * @param {string} phone
   * @returns {Observable<LoginResp>}
   * @memberof LoginService
   */
  private login(phone: string): Observable<LoginResp> {
    return this.http
      .post(this.loginUrl, {
        params: {
          UserName: phone
        }
      })
      .mergeMap(res => {
        const results = (res as APIResponse).result
        return this.fetchExhibitorContact(results[0].TenantId).map(contacts => {
          const admin = contacts.find(e => e.isAdmin === 1)
          if (!admin) {
            throw new Error(`该手机号未匹配到展商管理员`)
          }
          const user = contacts.find(e => e.Phone === phone)
          if (!user) {
            throw new Error(`该手机号未注册展商联系人`)
          }
          return {
            adminName: admin.Name,
            userName: user.Name,
            tenantId: results[0].TenantId,
            userId: results[0].UserId,
            exhibitorId: results[0].RecordId,
            companyName: results[0].CompanyName,
            boothNo: results[0].BoothNo,
            exhibitionIds: results.map(e => e.ExhibitionId)
          }
        })
      })
      .pipe(retry(this.MAX_RETRY_COUNT, this.RETRY_DELAY))
  }

  /**
   * 获取展商联系人
   *
   * @private
   * @param {string} tenantId
   * @returns {Observable<ExhibitorContact[]>}
   * @memberof LoginService
   */
  private fetchExhibitorContact(
    tenantId: string
  ): Observable<ExhibitorContact[]> {
    return this.http
      .post(this.queryExhibitorContact, {
        tenantId,
        params: {
          condition: {}
        }
      })
      .map(res => (res as any).result)
  }
}

function retry<T>(
  count = 3,
  delay = 5e2
): (source: Observable<T>) => Observable<T> {
  return (src: Observable<T>) => {
    return src.retryWhen(errors =>
      errors
        .scan((errCount, err) => {
          if (errCount >= count) {
            throw err
          }
          return errCount + 1
        }, 0)
        .delay(delay)
    )
  }
}
