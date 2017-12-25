import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from './interceptor'
import { TenantService } from './tenant.service'
import { Logger, LoggerLevel } from '../pages/customer/models/logger.model'

import { ErrorLoggerService } from './error-logger.service'
import { environment } from '../environments/environment'

const levelStrings: LoggerLevel[] = ['info', 'warn', 'error', 'sys']

@Injectable()
export class LoggerService {
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
   * @param {Logger} log
   * @returns {Observable<any>}
   * @memberof LoggerService
   */
  createLog(log: Logger, customerId): Observable<any> {
    const level = levelStrings.indexOf(log.level)

    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
          params: {
            record: {
              info: log.content,
              level,
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
    const level = levelStrings.indexOf(log.level)
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertListUrl + `/${tenantId}/${userId}`, {
          params: {
            recordlist: customerIds.map(e => ({
              info: log.content,
              level,
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
    const level = levelStrings.indexOf(log.level)

    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl + `/${log.id}/${tenantId}/${userId}`,
          {
            params: {
              setValue: {
                level,
                info: log.content
              }
            }
          }
        )
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
    return environment.production
      ? this.tenantService
          .getTenantIdAndUserId()
          .mergeMap(([tenantId, userId]) =>
            this.http.post(this.queryUrl + `/${tenantId}/${userId}`, {
              params: {
                condition: {
                  ContactInfo: customerId
                }
              }
            })
          )
          .map(res => {
            const results = (res as APIResponse).result
            return results.map(e => ({
              id: e.RecordId,
              time: e.CreatedAt,
              level: levelStrings[e.level],
              content: e.info
            }))
          })
          .catch(e => {
            return this.errorLogger.httpError({
              module: 'LoggerService',
              method: 'fetchLogger',
              error: e
            })
          })
      : Observable.of(
          Array.from({ length: 100 }, (_, i) => ({
            id: String(i),
            time: '2017-12-22 11:12:11',
            level: 'info',
            content: `test content ${i}`
          }))
        )
  }
}
