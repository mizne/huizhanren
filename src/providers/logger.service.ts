import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from './interceptor'
import { TenantService } from './tenant.service'
import { Logger } from '../pages/customer/models/logger.model'
import { ErrorLoggerService } from './error-logger.service'
import { environment } from '../environments/environment'

@Injectable()
export class LoggerService {
  private queryUrl: string = '/data/querybycondition/ExhibitorContactLog'
  private insertUrl: string = '/data/insert/ExhibitorContactLog'
  private updateUrl: string = '/data/update/ExhibitorContactLog'
  private insertListUrl: string = '/data/insertList/ExhibitorContactLog'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private errorLogger: ErrorLoggerService
  ) {}

  /**
   * 新建 log
   *
   * @param {Logger} log
   * @returns {Observable<any>}
   * @memberof LoggerService
   */
  createLog(log: Logger, customerId): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              ...Logger.convertFromModel(log),
              ContactInfo: customerId
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

  batchCreateLog(customerIds: string[], log: Logger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertListUrl, {
          tenantId,
          userId,
          params: {
            recordlist: customerIds.map(e => ({
              ...Logger.convertFromModel(log),
              ContactInfo: e
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

  editLog(log: Logger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            RecordId: log.id,
            setValue: {
              ...Logger.convertFromModel(log)
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
   * @returns {Observable<Logger[]>}
   * @memberof LoggerService
   */
  fetchLogger(customerId: string): Observable<Logger[]> {
    // return Observable.of(Logger.generateFakeLogs(100))
    return !environment.mock || environment.production
      ? this.tenantService
          .getTenantIdAndUserId()
          .mergeMap(([tenantId, userId]) =>
            this.http.post(this.queryUrl, {
              tenantId,
              userId,
              params: {
                condition: {
                  ContactInfo: customerId
                }
              }
            })
          )
          .map(res => (res as APIResponse).result.map(Logger.convertFromResp))
          .catch(e => {
            return this.errorLogger.httpError({
              module: 'LoggerService',
              method: 'fetchLogger',
              error: e
            })
          })
      : Observable.of(Logger.generateFakeLogs(100))
  }
}
