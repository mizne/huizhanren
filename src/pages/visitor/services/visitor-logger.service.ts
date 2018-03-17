import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { TenantService } from '../../../providers/tenant.service'
import { VisitorLogger } from '../models/visitor-logger.model'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

@Injectable()
export class VisitorLoggerService {
  private queryUrl: string = '/data/querybycondition/VisitorLog'
  private insertUrl: string = '/data/insert/VisitorLog'
  private updateUrl: string = '/data/update/VisitorLog'
  private insertListUrl: string = '/data/insertList/VisitorLog'

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
  createLog(log: VisitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              ...VisitorLogger.convertFromModel(log)
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'VisitorLoggerService',
          method: 'createLog',
          error: e
        })
      })
  }

  batchCreateLog(customerIds: string[], log: VisitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertListUrl, {
          tenantId,
          userId,
          params: {
            recordlist: customerIds.map(e => ({
              ...VisitorLogger.convertFromModel(log),
              ContactId: e
            }))
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'VisitorLoggerService',
          method: 'batchCreateLog',
          error: e
        })
      })
  }

  editLog(log: VisitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            recordId: log.id,
            setValue: {
              ...VisitorLogger.convertFromModel(log)
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'VisitorLoggerService',
          method: 'editLog',
          error: e
        })
      })
  }

  /**
   * 获取所有 logs
   *
   * @returns {Observable<VisitorLogger[]>}
   * @memberof LoggerService
   */
  fetchLogger(visitorID: string): Observable<VisitorLogger[]> {
    // return Observable.of(Logger.generateFakeLogs(100))
    return this.tenantService
          .getTenantIdAndUserId()
          .mergeMap(([tenantId, userId]) =>
            this.http.post(this.queryUrl, {
              tenantId,
              userId,
              params: {
                condition: {
                  visitorId: visitorID
                }
              }
            })
          )
          .map(res => (res as any).result.map(VisitorLogger.convertFromResp))
          .catch(e => {
            return this.errorLogger.httpError({
              module: 'VisitorLoggerService',
              method: 'fetchLogger',
              error: e
            })
          })
  }
}
