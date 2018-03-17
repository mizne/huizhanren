import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { TenantService } from '../../../providers/tenant.service'
import { ContactLogger } from '../models/logger.model'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

@Injectable()
export class ContactLoggerService {
  private queryUrl: string = '/data/querybycondition/ContactLog'
  private insertUrl: string = '/data/insert/ContactLog'
  private updateUrl: string = '/data/update/ContactLog'
  private insertListUrl: string = '/data/insertList/ContactLog'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private errorLogger: ErrorLoggerService
  ) {}

  /**
   * 新建 log
   *
   * @param {ContactLogger} log
   * @returns {Observable<any>}
   * @memberof LoggerService
   */
  createLog(log: ContactLogger, customerId): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              ...ContactLogger.convertFromModel(log),
              ContactId: customerId
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'LoggerService',
          method: 'createLog',
          error: e
        })
      })
  }

  batchCreateLog(customerIds: string[], log: ContactLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertListUrl, {
          tenantId,
          userId,
          params: {
            recordlist: customerIds.map(e => ({
              ...ContactLogger.convertFromModel(log),
              ContactId: e
            }))
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'LoggerService',
          method: 'batchCreateLog',
          error: e
        })
      })
  }

  editLog(log: ContactLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            recordId: log.id,
            setValue: {
              ...ContactLogger.convertFromModel(log)
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'LoggerService',
          method: 'editLog',
          error: e
        })
      })
  }

  /**
   * 获取所有 logs
   *
   * @returns {Observable<ContactLogger[]>}
   * @memberof LoggerService
   */
  fetchLogger(customerId: string): Observable<ContactLogger[]> {
    // return Observable.of(Logger.generateFakeLogs(100))
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl, {
          tenantId,
          userId,
          params: {
            condition: {
              ContactId: customerId
            }
          }
        })
      )
      .map(res => (res as any).result.map(ContactLogger.convertFromResp))
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'LoggerService',
          method: 'fetchLogger',
          error: e
        })
      })
  }
}
