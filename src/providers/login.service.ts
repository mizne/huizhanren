import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { Exhibition } from '../pages/login/models/exhibition.model'
import { APIResponse } from './interceptor'
import { ErrorLoggerService } from './error-logger.service'

export interface FetchExhibitionsAndLoginResp extends LoginResp {
  exhibitions: Exhibition[]
}

interface LoginResp {
  adminName: string
  userName: string
  tenantId: string
  userId: string
  exhibitorId: string
  companyName: string
  boothNo: string
  exhibitionIds: string[]
}
/*
  Generated class for the OcrServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginService {
  private exhibitionsUrl: string = '/data/queryList/Exhibition'
  private loginUrl: string = '/data/boxLogin'

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
    return (
      this.login(phone)
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

        // return Observable.forkJoin(this.fetchExhibitions(phone), this.login(phone))
        //   .map(([exhibitons, loginResp]) => {
        //     return {
        //       adminName: loginResp.adminName,
        //       userName: loginResp.userName,
        //       tenantId: loginResp.tenantId,
        //       userId: loginResp.userId,
        //       exhibitorId: loginResp.exhibitorId,
        //       companyName: loginResp.companyName,
        //       boothNo: loginResp.boothNo,
        //       exhibitions: exhibitons
        //     }
        //   })
        .catch(e => {
          return this.logger.httpError({
            module: 'LoginService',
            method: 'fetchExhibitionsAndLogin',
            error: e
          })
        })
    )
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
      .retryWhen(errStream =>
        errStream
          .scan((errCount, err) => {
            if (err.message === '没有查询到会展信息') {
              throw err
            }
            if (errCount >= this.MAX_RETRY_COUNT) {
              throw err
            }
            return errCount + 1
          }, 0)
          .delay(this.RETRY_DELAY)
      )
  }

  /**
   * 登录
   *
   * @private
   * @param {any} phone
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
      .map(res => {
        const results = (res as APIResponse).result
        const adminName = results[0].LinkList.find(e => e.admin === 1).LinkName
        const userName = results[0].LinkList.find(e => e.LinkMob === phone)
          .LinkName
        return {
          adminName: adminName,
          userName: userName,
          tenantId: results[0].TenantId,
          userId: results[0].UserId,
          exhibitorId: results[0].RecordId,
          companyName: results[0].CompanyName,
          boothNo: results[0].BoothNo,
          exhibitionIds: results.map(e => e.ExhibitionId)
        }
      })
      .retryWhen(errStream =>
        errStream
          .scan((errCount, err) => {
            if (errCount >= this.MAX_RETRY_COUNT) {
              throw err
            }
            return errCount + 1
          }, 0)
          .delay(this.RETRY_DELAY)
      )
  }
}
