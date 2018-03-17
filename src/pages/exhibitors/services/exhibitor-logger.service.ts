import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { TenantService } from '../../../providers/tenant.service'
import { ExhibitorLogger } from '../models/exhibitor-logger.model'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

@Injectable()
export class ExhibitorLoggerService {
  private queryUrl: string = '/data/querybycondition/ExhibitorLog'
  private insertUrl: string = '/data/insert/ExhibitorLog'
  private updateUrl: string = '/data/update/ExhibitorLog'
  private insertListUrl: string = '/data/insertList/ExhibitorLog'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private errorLogger: ErrorLoggerService
  ) {}

  /**
   * 新建 log
   *
   * @param {ExhibitorLogger} log
   * @returns {Observable<any>}
   * @memberof ExhibitorLoggerService
   */
  createLog(log: ExhibitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, _, exhibitionId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              ...ExhibitorLogger.convertFromModel(log),
              ExhibitionId: exhibitionId
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'ExhibitorLoggerService',
          method: 'createLog',
          error: e
        })
      })
  }

  batchCreateLog(customerIds: string[], log: ExhibitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertListUrl, {
          tenantId,
          userId,
          params: {
            recordlist: customerIds.map(e => ({
              ...ExhibitorLogger.convertFromModel(log),
              ContactId: e
            }))
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'ExhibitorLoggerService',
          method: 'batchCreateLog',
          error: e
        })
      })
  }

  editLog(log: ExhibitorLogger): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            recordId: log.id,
            setValue: {
              ...ExhibitorLogger.convertFromModel(log)
            }
          }
        })
      })
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'ExhibitorLoggerService',
          method: 'editLog',
          error: e
        })
      })
  }

  /**
   * 获取所有 logs
   *
   * @returns {Observable<ExhibitorLogger[]>}
   * @memberof ExhibitorLoggerService
   */
  fetchLogger(exhibitorID: string): Observable<ExhibitorLogger[]> {
    // return Observable.of(Logger.generateFakeLogs(100))
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl, {
          tenantId,
          userId,
          params: {
            condition: {
              ExhibitorId: exhibitorID
            }
          }
        })
      )
      .map(res => (res as any).result.map(ExhibitorLogger.convertFromResp))
      .catch(e => {
        return this.errorLogger.httpError({
          module: 'ExhibitorLoggerService',
          method: 'fetchLogger',
          error: e
        })
      })
  }
}
