import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import { Notification } from '../models/notification.model'

@Injectable()
export class NotificationService {
  private queryUrl: string = '/data/querybycondition/Remind'
  private insertUrl: string = '/data/insert/Remind'
  private updateUrl: string = '/data/update/Remind'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 在当前客户下 创建notification
   *
   * @param {Notification} notification
   * @param {string} customerId
   * @returns {Observable<any>}
   * @memberof NotificationService
   */
  createNotification(
    notification: Notification,
    customerId: string
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              RemindContent: notification.content,
              RemindDate: notification.time,
              ContactId: customerId
            }
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'NotificationService',
          method: 'createNotification',
          error: e
        })
      })
  }

  /**
   * 在当前客户下 修改notification
   *
   * @param {Notification} notification
   * @returns {Observable<any>}
   * @memberof NotificationService
   */
  editNotification(notification: Notification): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            RecordId: notification.id,
            setValue: {
              RemindContent: notification.content,
              RemindDate: notification.time
            }
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'NotificationService',
          method: 'editNotification',
          error: e
        })
      })
  }

  /**
   * 获取当前客户的 所有notifications
   *
   * @param {any} customerId
   * @returns {Observable<Notification[]>}
   * @memberof NotificationService
   */
  fetchNotifications(customerId): Observable<Notification[]> {
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
      .map(res => (res as APIResponse).result.map(Notification.convertFromResp))
      .map(notifications => {
        // 重新排序提醒 未过期正序 过期倒序
        const unTimeoutResults = notifications
          .filter(e => Date.now() < new Date(e.time).getTime())
          .sort(
            (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
          )
          .map(e => ({
            ...e,
            expired: false
          }))

        const timeoutResults = notifications
          .filter(e => Date.now() >= new Date(e.time).getTime())
          .sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
          )
          .map(e => ({
            ...e,
            expired: true
          }))

        return [...unTimeoutResults, ...timeoutResults]
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'NotificationService',
          method: 'fetchNotifications',
          error: e
        })
      })
  }
}
