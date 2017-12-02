import { Injectable } from '@angular/core'
// import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs/Observable'

// import { TenantServiceProvider } from '../../../providers/tenant-service/tenant.service'

@Injectable()
export class OtherService {
  // private queryUrl: string = '/data/querybycondition/User'

  constructor() {}

  /**
   * 检查 版本更新
   *
   * @returns {Observable<any>}
   * @memberof UserService
   */
  checkUpdate(): Observable<any> {
    // return this.tenantService.getTenantIdAndUserId()
    // .mergeMap(([tenantId, userId]) => {
    //   return this.http.get(this.queryUrl + `/${tenantId}/${userId}`)
    // })
    // .catch(this.handleError)

    return Observable.of('已是最新版本').delay(2e3)
  }

  // private handleError(error: any): Observable<any> {
  //   console.error(error)
  //   return _throw(error)
  // }
}
