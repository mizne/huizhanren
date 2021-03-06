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
   * @param {string} base64Img
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  uploadCardImage(base64Img: string): Observable<any> {
    return this.http
      .post(this.uploadImgUrl, {
        url: base64Img
      })
      .map(res => (res as APIResponse).result)
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
   * @param {string} exhibitionId
   * @returns {Observable<any>}
   * @memberof CustomerService
   */
  createCustomer(customer: Customer, exhibitionId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserIdAndExhibitorIdAndExhibitionId()
      .mergeMap(([tenantId, userId, exhibitorId, _]) => {
        const params = {
          tenantId,
          userId,
          params: {
            record: {
              Name: customer.name,
              ExhibitionId: exhibitionId,
              ExhibitorId: exhibitorId,
              ContactGroupId: [],
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
        return this.http.post(this.insertUrl, params)
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
   * @param {string} exhibitionId
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
          tenantId,
          userId,
          params: {
            recordId: customerId,
            setValue: {
              ExhibitionId: exhibitionId,
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
        return this.http.post(this.updateUrl, params)
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
   * @param {any} exhibitionId
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
          tenantId,
          userId,
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
        return this.http.post(this.updateListUrl, params)
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
   * @param {Customer[]} customers
   * @param {string} groupId
   * @param {string} exhibitionId
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
          tenantId,
          userId,
          params: customers.map(customer => {
            return {
              recordId: customer.id,
              setValue: {
                ExhibitionId: exhibitionId,
                ContactGroupId: (() => {
                  if (groupId === Group.NONE.id) {
                    return []
                  } else {
                    return deduplicate([...customer.groups, groupId])
                  }
                })()
              }
            }
          })
        }

        return this.http.post(this.updateListUrl, params)
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
    const needRemoveGroupIdCustomers = customers.filter(
      customer => customer.groups.indexOf(groupId) >= 0
    )
    if (needRemoveGroupIdCustomers.length === 0) {
      return Observable.of('No customer to need remove group id')
    }
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        const params = {
          tenantId,
          userId,
          params: needRemoveGroupIdCustomers.map(customer => {
            return {
              recordId: customer.id,
              setValue: {
                ExhibitionId: exhibitionId,
                ContactGroupId: (() => {
                  const index = customer.groups.indexOf(groupId)
                  return customer.groups.filter((_, i) => i !== index)
                })()
              }
            }
          })
        }

        return this.http.post(this.updateListUrl, params)
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
   * @param {Customer} customer
   * @param {string} groupId
   * @param {string} exhibitionId
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
        return this.http.post(this.updateUrl, {
          tenantId,
          userId,
          params: {
            recordId: customer.id,
            setValue: {
              ExhibitionId: exhibitionId,
              ContactGroupId: (() => {
                if (groupId === Group.NONE.id) {
                  return []
                } else {
                  return deduplicate([...customer.groups, groupId])
                }
              })()
            }
          }
        })
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
        return this.http.post(this.deleteListUrl, {
          tenantId,
          userId,
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
  singleDeleteCustomer(customerId: string): Observable<any> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) => {
        return this.http.post(this.deleteUrl, {
          tenantId,
          userId,
          params: {
            recordId: customerId
          }
        })
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
    return this.fetchCustomers({}).catch(e => {
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
    return this.fetchCustomers({
      RecordId: customerId
    })
      .map(customers => {
        return customers[0]
      })
      .catch(e => {
        return this.logger.httpError({
          module: 'CustomerService',
          method: 'fetchSingleCustomer',
          error: e
        })
      })
  }

  private fetchCustomers(condition: any): Observable<Customer[]> {
    return this.tenantService
      .getTenantIdAndUserId()
      .mergeMap(([tenantId, userId]) =>
        this.http.post(this.queryUrl, {
          tenantId,
          userId,
          params: {
            condition
          }
        })
      )
      .map(res => {
        return (res as APIResponse).result.map(Customer.convertFromResp)
      })
  }
}
