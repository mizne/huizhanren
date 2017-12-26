import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

import { APIResponse } from '../../../providers/interceptor'
import { TenantService } from '../../../providers/tenant.service'
import { ErrorLoggerService } from '../../../providers/error-logger.service'
import { HOST } from '../../../providers/interceptor'
import { GroupService } from './group.service'

import { Customer } from '../models/customer.model'
import { Group } from '../models/group.model'
import { deduplicate } from './utils'

export interface InitFetchAllResp {
  customers: Customer[]
  groups: Group[]
}

@Injectable()
export class CustomerService {
  private queryUrl: string = '/data/querybycondition/Contact'
  private updateUrl: string = '/data/update/Contact'
  private insertUrl: string = '/data/insert/Contact'
  private deleteUrl: string = '/data/delete/Contact'

  private updateListUrl: string = '/data/updateList/Contact'
  private deleteListUrl: string = '/data/deleteList/Contact'
  private uploadImgUrl: string = '/data/upload'

  constructor(
    private http: HttpClient,
    private groupService: GroupService,
    private tenantService: TenantService,
    private logger: ErrorLoggerService
  ) {}

  /**
   * 初始化获取所有 customers 和 groups
   *
   * @returns {Observable<InitFetchAllResp>}
   * @memberof CustomerService
   */
  initialFetchAll(): Observable<InitFetchAllResp> {
    return Observable.zip(
      this.fetchAllCustomer(),
      this.groupService.fetchAllGroup(),
      (customers, groups) => ({ customers, groups })
    ).catch(e => {
      return this.logger.httpError({
        module: 'CustomerService',
        method: 'initialFetchAll',
        error: e
      })
    })
  }

  /**
   * 将base64Img上传 返回文件的路径地址
   *
   * @param {any} base64Img
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  uploadCardImage(base64Img): Observable<any> {
    return this.http
      .post(this.uploadImgUrl, {
        rawBody: base64Img
      })
      .map(res => HOST + '/' + (res as APIResponse).result)
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'uploadCardImage',
          error: e
        })
      })
  }

  /**
   * 新建 customer
   *
   * @param {Customer} customer
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  createCustomer(customer: Customer, exhibitionId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          params: {
            record: {
              Name: customer.name,
              ExhibitionInfo: exhibitionId,
              GroupInfo: [],
              Address: customer.addresses,
              Phone: customer.phones,
              Email: customer.emails,
              Department: customer.departments,
              Job: customer.jobs,
              Company: customer.companys,
              Image: customer.imageUrl,
              BackImage: customer.imageBehindUrl
            }
          }
        }
        return this.http.post(this.insertUrl + `/${tenantId}/${userId}`, params)
      })
      .map(res => {
        const result = (res as APIResponse).result

        return result
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'createCustomer',
          error: e
        })
      })
  }

  /**
   * 编辑客户
   *
   * @param {Customer} customer
   * @param {string} customerId
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  editCustomer(
    customer: Customer,
    customerId: string,
    exhibitionId: string
  ): Observable<any> {
    const mapper = e => ({
      label: e.label,
      value: e.value
    })
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          params: {
            setValue: {
              ExhibitionInfo: exhibitionId,
              Name: customer.name,
              Phone: customer.phones.map(mapper),
              Email: customer.emails.map(mapper),
              Address: customer.addresses.map(mapper),
              Department: customer.departments.map(mapper),
              Job: customer.jobs.map(mapper),
              Company: customer.companys.map(mapper),
              BackImage: customer.imageBehindUrl
            }
          }
        }
        return this.http.post(
          this.updateUrl + `/${customerId}/${tenantId}/${userId}`,
          params
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'editCustomer',
          error: e
        })
      })
  }

  /**
   * 批量标记 哪些客户已经发过短信
   *
   * @param {string[]} customerIds
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  markCustomersHasSendSms(
    customerIds: string[],
    exhibitionId
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          params: customerIds.map(id => {
            return {
              recordId: id,
              setValue: {
                ExhibitionInfo: exhibitionId,
                HaveSendMsg: true
              }
            }
          })
        }
        return this.http.post(
          this.updateListUrl + `/${tenantId}/${userId}`,
          params
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'markCustomersHasSendSms',
          error: e
        })
      })
  }

  /**
   * 批量设置分组
   *
   * @param {string} groupId
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  batchEditCustomerGroupId(
    customers: Customer[],
    groupId: string,
    exhibitionId: string
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          params: customers.map(customer => {
            return {
              recordId: customer.id,
              setValue: {
                ExhibitionInfo: exhibitionId,
                GroupInfo: (() => {
                  if (groupId === '无标签') {
                    return []
                  } else {
                    return deduplicate([...customer.groups, groupId])
                  }
                })()
              }
            }
          })
        }

        return this.http.post(
          this.updateListUrl + `/${tenantId}/${userId}`,
          params
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'batchEditCustomerGroupId',
          error: e
        })
      })
  }

  /**
   * 将已被删除的 group 从 customer 中删除
   *
   * @param {Customer[]} customers
   * @param {string} groupId
   * @param {string} exhibitionId
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  removeCustomerGroupId(
    customers: Customer[],
    groupId: string,
    exhibitionId: string
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          params: customers
            .filter(customer => customer.groups.indexOf(groupId) >= 0)
            .map(customer => {
              return {
                recordId: customer.id,
                setValue: {
                  ExhibitionInfo: exhibitionId,
                  GroupInfo: (() => {
                    const index = customer.groups.indexOf(groupId)
                    return customer.groups.filter((_, i) => i !== index)
                  })()
                }
              }
            })
        }

        return this.http.post(
          this.updateListUrl + `/${tenantId}/${userId}`,
          params
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'removeCustomerGroupId',
          error: e
        })
      })
  }

  /**
   * 单条删除分组
   *
   * @param {string} customerId
   * @param {string} groupId
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  singleEditCustomerGroupId(
    customer: Customer,
    groupId: string,
    exhibitionId: string
  ): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.updateUrl + `/${customer.id}/${tenantId}/${userId}`,
          {
            params: {
              setValue: {
                ExhibitionInfo: exhibitionId,
                GroupInfo: (() => {
                  if (groupId === '无标签') {
                    return []
                  } else {
                    return deduplicate([...customer.groups, groupId])
                  }
                })()
              }
            }
          }
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'singleEditCustomerGroupId',
          error: e
        })
      })
  }

  /**
   * 批量删除客户
   *
   * @returns {Ob}
   * @memberof CustomerService
   */
  batchDeleteCustomer(customerIds: string[]): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.deleteListUrl + `/${tenantId}/${userId}`, {
          params: customerIds.map(e => ({ recordId: e }))
        })
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'batchDeleteCustomer',
          error: e
        })
      })
  }

  /**
   * 单条删除 客户
   *
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  singleDeleteCustomer(customerId): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(
          this.deleteUrl + `/${customerId}/${tenantId}/${userId}`,
          {
            params: {
              recordId: customerId
            }
          }
        )
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'singleDeleteCustomer',
          error: e
        })
      })
  }

  /**
   * 获取所有 customers
   *
   * @returns {Observable<Customer[]>}
   * @memberof CustomerService
   */
  fetchAllCustomer(): Observable<Customer[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl + `/${tenantId}/${userId}`, {
          params: {
            condition: {}
          }
        })
      )
      .map(res => {
        const results = (res as APIResponse).result
        const customers: Customer[] = results.map(e => ({
          id: e.RecordId,
          groups: e.GroupInfo,
          name: e.Name,
          phones: e.Phone.map(e => ({ ...e, selected: true })),
          emails: e.Email.map(e => ({ ...e, selected: true })),
          addresses: e.Address.map(e => ({ ...e, selected: true })),
          departments: e.Department.map(e => ({ ...e, selected: true })),
          jobs: e.Job.map(e => ({ ...e, selected: true })),
          companys: e.Company.map(e => ({ ...e, selected: true })),
          imageUrl: e.Image,
          imageBehindUrl: e.BackImage,
          haveCalled: e.HaveCalled,
          haveSendEmail: e.HaveSendEmail,
          haveSendMsg: e.HaveSendMsg,
          selected: false
        }))

        return customers
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'fetchAllCustomer',
          error: e
        })
      })
  }
/**
 * 获取单条客户信息
 *
 * @param {string} customerId
 * @returns {Observable<Customer>}
 * @memberof CustomerService
 */
fetchSingleCustomer(customerId: string): Observable<Customer> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl + `/${tenantId}/${userId}`, {
          params: {
            condition: {
              RecordId: customerId
            }
          }
        })
      )
      .map(res => {
        const results = (res as APIResponse).result
        const customers: Customer[] = results.map(e => ({
          id: e.RecordId,
          groups: e.GroupInfo,
          name: e.Name,
          phones: e.Phone.map(e => ({ ...e, selected: true })),
          emails: e.Email.map(e => ({ ...e, selected: true })),
          addresses: e.Address.map(e => ({ ...e, selected: true })),
          departments: e.Department.map(e => ({ ...e, selected: true })),
          jobs: e.Job.map(e => ({ ...e, selected: true })),
          companys: e.Company.map(e => ({ ...e, selected: true })),
          imageUrl: e.Image,
          imageBehindUrl: e.BackImage,
          haveCalled: e.HaveCalled,
          haveSendEmail: e.HaveSendEmail,
          haveSendMsg: e.HaveSendMsg,
          selected: false
        }))

        return customers[0]
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'fetchAllCustomer',
          error: e
        })
      })
  }
}

