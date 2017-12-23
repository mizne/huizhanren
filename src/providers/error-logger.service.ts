import { Injectable } from '@angular/core'
import { TenantService } from './tenant.service'
import * as Raven from 'raven-js'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs/Observable';

interface ErrorInfo {
  module: string
  method: string
  description: string
}

interface HttpErrorInfo {
  module: string
  method: string
  error: any
}

/*
  Generated class for the LoggerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ErrorLoggerService {
  constructor(private tenantService: TenantService) {}

  /**
   * info 级别日志记录
   *
   * @param {ErrorInfo} error
   * @returns {(Promise<any> | void)}
   * @memberof LoggerService
   */
  info(error: ErrorInfo): Promise<any> | void {
    if (environment.production) {
      return this.postErrorMessage(
        error.module,
        'INFO',
        error.method,
        error.description
      )
    } else {
      console.info(error.description)
    }
  }

  /**
   * error 级别日志记录
   *
   * @param {ErrorInfo} error
   * @returns {(Promise<any> | void)}
   * @memberof LoggerService
   */
  error(error: ErrorInfo): Promise<any> | void {
    if (environment.production) {
      return this.postErrorMessage(
        error.module,
        'ERROR',
        error.method,
        error.description
      )
    } else {
      console.error(error.description)
    }
  }
/**
 * 记录 Http error
 *
 * @param {HttpErrorInfo} info
 * @returns {Observable<any>}
 * @memberof LoggerService
 */
httpError(info: HttpErrorInfo): Observable<any> {
    const errMsg = info.error.message
      ? info.error.message
      : info.error.status
        ? `${info.error.status} - ${info.error.statusText}`
        : 'Server error'

    this.error({
      module: info.module,
      method: info.method,
      description: errMsg
    })

    return Observable.throw(errMsg)
  }

  /**
   * 调用 Sentry.io 实现
   * https://docs.sentry.io/clients/javascript/integrations/angular/
   *
   * @private
   * @param {any} module
   * @param {any} level
   * @param {any} method
   * @param {any} description
   * @returns {Promise<any>}
   * @memberof LoggerService
   */
  private postErrorMessage(module, level, method, description): Promise<any> {
    return this.tenantService.getLoginName()
    .then((loginName) => {
      const msg = `Module: ${module}, Method: ${method}, LoginName: ${loginName}, description: ${description}`

      Raven.captureMessage(
        msg,
        level === 'INFO' ? { level: 'info' } : undefined
      )
    })
  }
}
