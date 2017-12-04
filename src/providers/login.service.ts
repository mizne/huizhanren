import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { Exhibition } from '../pages/login/models/exhibition.model'
import { APIResponse } from './interceptor'

export interface FetchExhibitionsAndLoginResp extends LoginResp {
  companyName: string
  exhibitions: Exhibition[]
}

interface LoginResp {
  adminName: string
  userName: string
  tenantId: string
  userId: string
}
/*
  Generated class for the OcrServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LoginService {
  private exhibitionsUrl: string = '/sys/exhibitions'
  private loginUrl: string = '/sys/exhibitionLogin'

  /**
   * 最大 http请求错误 重试次数
   *
   * @private
   * @type {number}
   * @memberof LoginServiceProvider
   */
  private MAX_RETRY_COUNT: number = 3
  /**
   * http请求错误 重试间隔时间
   *
   * @private
   * @type {number}
   * @memberof LoginServiceProvider
   */
  private RETRY_DELAY: number = 5e2

  constructor(public http: HttpClient) {}

  /**
   * 调用获取Exhibitions接口获取 所有会展信息
   * 调用登录接口去获取 管理员、用户名
   *
   * @param {any} phone
   * @returns {Observable<FetchExhibitionsAndLoginResp>}
   * @memberof LoginServiceProvider
   */
  fetchExhibitionsAndLogin(phone): Observable<FetchExhibitionsAndLoginResp> {
    return Observable.forkJoin(this.fetchExhibitions(phone), this.login(phone))
      .map(([exhibitons, loginResp]) => {
        return {
          adminName: loginResp.adminName,
          userName: loginResp.userName,
          tenantId: loginResp.tenantId,
          userId: loginResp.userId,
          companyName: exhibitons[0].companyName,
          exhibitions: exhibitons
        }
      })
      .catch(this.handleError)
  }

  /**
   * 获取所有展会信息
   *
   * @private
   * @param {any} phone
   * @returns {Observable<Exhibition[]>}
   * @memberof LoginServiceProvider
   */
  private fetchExhibitions(phone): Observable<any[]> {
    return this.http
      .post(this.exhibitionsUrl, {
        params: {
          UserName: phone
        }
      })
      .map(res => {
        const results = (res as APIResponse).result
        if (results.length === 0) {
          throw new Error('没有查询到会展信息')
        }
        return results.map(e => ({
          id: e.RecordId,
          name: e.ItemName,
          startTime: e.startTime,
          endTime: e.endTime,
          companyName: e.companyName,
          boothNo: e.BoothNo
        }))
      })
      .retryWhen(errStream => errStream.scan((errCount, err) => {
        if (err.message === '没有查询到会展信息') {
          throw err
        }
        if (errCount >= this.MAX_RETRY_COUNT) {
          throw err
        }
        return errCount + 1
      }, 0).delay(this.RETRY_DELAY))
  }

  /**
   * 登录
   *
   * @private
   * @param {any} phone
   * @returns {Observable<LoginResp>}
   * @memberof LoginServiceProvider
   */
  private login(phone): Observable<LoginResp> {
    return this.http
      .post(this.loginUrl, {
        params: {
          UserName: phone
        }
      })
      .map(res => {
        const results = (res as APIResponse).result
        return {
          adminName: results[0].adminName,
          userName: results[0].Name,
          tenantId: results[0].TenantId,
          userId: results[0].UserId
        }
      })
      .retryWhen(errStream => errStream.scan((errCount, err) => {
        if (errCount >= this.MAX_RETRY_COUNT) {
          throw err
        }
        return errCount + 1
      }, 0).delay(this.RETRY_DELAY))
  }

  /**
   * http 错误处理
   *
   * @private
   * @param {*} error
   * @returns {Observable<any>}
   * @memberof OrderProvider
   */
  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
