import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'

import { Group } from '../models/group.model'

@Injectable()
export class GroupService {
  private queryUrl: string = '/data/querybycondition/ContactGroup'
  private insertUrl: string = '/data/insert/ContactGroup'
  private updateUrl: string = '/data/update/ContactGroup'
  private deleteUrl: string = '/data/delete/ContactGroup'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 新建 group
   *
   * @param {string} name
   * @param {string} exhibitionId
   * @returns {Observable<Group[]>}
   * @memberof GroupService
   */
  createGroup(name: string, exhibitionId: string): Observable<Group[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.insertUrl, {
          tenantId,
          userId,
          params: {
            record: {
              Name: name,
              ExhibitionId: exhibitionId
            }
          }
        })
      )
      .map(res => (res as APIResponse).result)
      .catch(e => {
        return this.logger.httpError({
          module: 'GroupService',
          method: 'createGroup',
          error: e
        })
      })
  }

  /**
   * 删除 group
   *
   * @param {any} groupId
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  delGroup(groupId): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.deleteUrl, {
          tenantId,
          userId,
          params: {
            recordId: groupId
          }
        })
      )
      .map(res => (res as APIResponse).result)
      .catch(e => {
        return this.logger.httpError({
          module: 'GroupService',
          method: 'delGroup',
          error: e
        })
      })
  }

  /**
   * 编辑 group
   *
   * @param {string} groupId
   * @param {string} groupName
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  editGroup(groupId: string, groupName: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            setValue: {
              Name: groupName
            }
          }
        })
      )
      .map(res => (res as APIResponse).result)
      .catch(e => {
        return this.logger.httpError({
          module: 'GroupService',
          method: 'editGroup',
          error: e
        })
      })
  }

  /**
   * 获取所有 groups 默认加个 无标签
   *
   * @returns {Observable<Group[]>}
   * @memberof GroupService
   */
  fetchAllGroup(): Observable<Group[]> {
    return this.fetchGroup({})
      .map(groups => {
        return [Group.NONE, ...groups]
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'GroupService',
          method: 'fetchAllGroup',
          error: e
        })
      })
  }

  private fetchGroup(condition): Observable<Group[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.queryUrl, {
          tenantId,
          userId,
          params: {
            condition
          }
        })
      })
      .map(res => (res as APIResponse).result.map(Group.convertFromResp))
  }
}
