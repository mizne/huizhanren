import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { Notification }from '../models/notification.model'

@Injectable()
export class NotificationService {
  private queryUrl: string = '/data/querybycondition/Remind'
  private insertUrl: string = '/data/insert/Remind'
  private updateUrl: string = '/data/update/Remind'

  constructor(private http: HttpClient, private tenantService: TenantService) {}

  /**
   * 在当前客户下 创建notification
   *
   * @param {Notification} notification
   * @returns {Observable<any>}
   * @memberof NotificationService
   */
  createNotification(notification: Notification, customerId: string): Observable<any> {
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) => {
      return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
        params: {
          record: {
            RemindContent: notification.content,
            RemindDate: notification.time,
            ContactInfo: customerId
          }
        }
      })
    })
    .catch(this.handleError)
  }


  /**
   * 在当前客户下 修改notification
   *
   * @param {Notification} notification
   * @returns {Observable<any>}
   * @memberof NotificationService
   */
  editNotification(notification: Notification): Observable<any> {
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) => {
      return this.http.post(this.updateUrl + `/${notification.id}/${tenantId}/${userId}`, {
        params: {
          setValue: {
            RemindContent: notification.content,
            RemindDate: notification.time
          }
        }
      })
    })
    .catch(this.handleError)
  }


  /**
   * 获取当前客户的 所有notifications
   *
   * @returns {Observable<Notification[]>}
   * @memberof NotificationService
   */
  fetchNotifications(customerId): Observable<Notification[]> {
    return this.tenantService.getTenantIdAndUserId()
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
      const results = (res as APIResponse).result.map(e => ({
        id: e.RecordId,
        time: e.RemindDate,
        content: e.RemindContent
      }))
      // 重新排序提醒 未过期正序 过期倒序

      const unTimeoutResults = results
      .filter(e => Date.now() < new Date(e.time).getTime())
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())

      const timeoutResults = results
      .filter(e => Date.now() >= new Date(e.time).getTime())
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

      return [...unTimeoutResults, ...timeoutResults]
    })
    .catch(this.handleError)
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }

}
