import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { APIResponse } from './interceptor'
import { TenantService } from './tenant.service'
import { SmsTemplate, SmsContent } from '../pages/customer/models/sms.model'

// import { environment } from '../environments/environment'
import { ErrorLoggerService } from './error-logger.service'

/*
  Generated class for the OcrServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SmsService {
  private fetchUrl: string = '/data/smscode'
  private insertUrl = '/data/insert/SmsTemplate'
  private sendUrl: string = '/data/smsSend'
  private queryUrl: string = '/data/querybycondition/SmsTemplate'

  constructor(
    public http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 获取验证码
   *
   * @param {string} phone
   * @returns {Observable<any>}
   * @memberof SmsService
   */
  fetchVerifyCode(phone: string): Observable<any> {
    return this.http.get(this.fetchUrl + `?phoneNumber=${phone}`).catch(e => {
      return this.logger.httpError({
        module: 'SmsService',
        method: 'fetchVerifyCode',
        error: e
      })
    })
  }
  /**
   * 校验验证码
   *
   * @param {string} phone
   * @param {string} code
   * @returns {Observable<any>}
   * @memberof SmsService
   */
  verifyCode(phone: string, code: string): Observable<any> {
    // return environment.production
    // ? this.http.post(this.fetchUrl, {
    //   phoneNumber: phone,
    //   verifyCode: code
    // })
    // .catch(e => {
    //   return this.logger.httpError({
    //     module: 'SmsService',
    //     method: 'verifyCode',
    //     error: e
    //   })
    // })
    // : Observable.of({})
    return Observable.of({})
  }
/**
 * 新增短信模版
 *
 * @param {SmsTemplate} template
 * @returns {Observable<any>}
 * @memberof SmsService
 */
createSmsTemplate(template: SmsTemplate): Observable<any> {
    return this.tenantService
    .getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) => {
      return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
        params: {
          record: SmsTemplate.convertFromModal(template)
        }
      })
    })
    .catch(e => {
      return this.logger.httpError({
        module: 'SmsService',
        method: 'createSmsTemplate',
        error: e
      })
    })
  }

  editSmsTemplate() {}

  /**
   * 获取所有 短信模板
   *
   * @returns {Observable<SmsTemplate[]>}
   * @memberof SmsService
   */
  fetchAllTemplate(): Observable<SmsTemplate[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.queryUrl + `/${tenantId}/${userId}`, {
          params: {
            condition: {}
          }
        })
      })
      .map(res => {
        const results = (res as APIResponse).result
        return results.map(SmsTemplate.convertFromResp)
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'SmsService',
          method: 'fetchAllTemplate',
          error: e
        })
      })
  }
  /**
   * 发送短信
   *
   * @param {string} templateId
   * @param {SmsContent[]} smsContents
   * @returns {Observable<any>}
   * @memberof SmsService
   */
  sendMessage(templateId: string, smsContents: SmsContent[]): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.sendUrl, {
          content: smsContents.map(e => ({
            phoneNumbers: e.phone,
            code: e.content
          })),
          tenantId,
          userId,
          smsTemplateId: templateId
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'SmsService',
          method: 'sendMessage',
          error: e
        })
      })
  }
}
