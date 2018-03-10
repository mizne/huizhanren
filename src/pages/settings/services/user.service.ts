import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import { User } from '../models/user.model'

@Injectable()
export class UserService {
  private queryUrl: string = '/data/querybycondition/User'
  private insertUrl: string = '/data/insert/User'
  private deleteUrl: string = '/data/delete/User'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 新增用户为可登录状态
   *
   * @param {User} user
   * @returns {Observable<any>}
   * @memberof UserService
   */
  createUser(user: User): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              Name: user.name,
              UserName: user.phone,
              UserPassword: 888888,
              Admin: '0'
            }
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'UserService',
          method: 'createUser',
          error: e
        })
      })
  }

  /**
   * 获取所有可登录 用户
   *
   * @returns {Observable<User[]>}
   * @memberof UserService
   */
  fetchAllUsers(): Observable<User[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl, {
          tenantId,
          userId,
          params: {
            condition: {
              Admin: '0'
            }
          }
        })
      )
      .map(res => {
        const results = (res as APIResponse).result
        return results.map(e => ({
          id: e.RecordId,
          name: e.Name,
          phone: e.UserName
        }))
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'UserService',
          method: 'fetchAllUsers',
          error: e
        })
      })
  }

  /**
   * 根据id 将其置于不可登录状态
   *
   * @param {string} id
   * @returns {Observable<any>}
   * @memberof UserService
   */
  deleteUser(id: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.deleteUrl, {
          tenantId,
          userId,
          params: {
            recordId: id
          }
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'UserService',
          method: 'deleteUser',
          error: e
        })
      })
  }
}
