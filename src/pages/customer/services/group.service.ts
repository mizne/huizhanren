import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'

import { Group } from '../models/group.model'

@Injectable()
export class GroupService {
  private queryUrl: string = '/data/querybycondition/ContactGroup'
  private insertUrl: string = '/data/insert/ContactGroup'
  private updateUrl: string = '/data/update/ContactGroup'
  private deleteUrl: string = '/data/delete/ContactGroup'

  constructor(
    private http: HttpClient,
    private tenantService: TenantService
  ) {}

  /**
   * 新建 group
   *
   * @param {string} name
   * @returns {Observable<Group[]>}
   * @memberof GroupService
   */
  createGroup(name: string, exhibitionId: string): Observable<Group[]> {
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) =>
      this.http.post(this.insertUrl + `/${tenantId}/${userId}`, {
        params: {
          record: {
            Name: name,
            ExhibitionInfo: exhibitionId
          }
        }
      })
    )
    .map(res => (res as APIResponse).result)
    .catch(this.handleError)
  }

  /**
   * 删除 group
   *
   * @param {any} groupId
   * @returns {Observable<any>}
   * @memberof GroupService
   */
  delGroup(groupId): Observable<any> {
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) =>
      this.http.post(this.deleteUrl + `/${groupId}/${tenantId}/${userId}`, {
        params: {
          recordId: groupId
        }
      })
    )
    .map(res => (res as APIResponse).result)
    .catch(this.handleError)
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
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) =>
      this.http.post(this.updateUrl + `/${groupId}/${tenantId}/${userId}`, {
        params: {
          setValue: {
            Name: groupName,
          }
        }
      })
    )
    .map(res => (res as APIResponse).result)
    .catch(this.handleError)
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
      return [{
        id: '无标签',
        name: '无标签',
        active: true,
        selected: false,
        createdAt: '1970-01-01 00:00:00',
        scrollTop: 0,
      }, ...groups]
    })
    .catch(this.handleError)
  }

  private fetchGroup(condition): Observable<Group[]> {
    return this.tenantService.getTenantIdAndUserId()
    .mergeMap(([tenantId, userId]) => {
      return this.http.post(this.queryUrl + `/${tenantId}/${userId}`, {
        params: {
          condition
        }
      })
    })
    .map(res => (res as APIResponse).result)
    .map(groups => groups.map(group => ({
      id: group.RecordId,
      name: group.Name,
      active: false,
      selected: false,
      createdAt: group.CreatedAt,
      scrollTop: 0
    })))
  }

  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw
    (error)
  }

}
