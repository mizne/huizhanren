import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable'

// export const HOST = 'http://huizhanren.xiaovbao.cn'
// export const HOST = 'http://192.168.0.129:3012'
export const HOST = 'http://192.168.1.6:3012'


export const API_VERSION ='v1'
export const BASE_URL = `${HOST}/${API_VERSION}`


@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private url: string = BASE_URL

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone({
      url: /http/.test(req.url) ? req.url : `${this.url}${req.url}`
    }))
    .do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        if (event.body && event.url.indexOf(HOST) >= 0) {
          if (event.body.resCode !== 0 && event.body.resCode !== 10000) {
            console.error(`API Error; ${event.body.resMsg}`)
            throw new Error(event.body.resMsg)
          }
        }
      }
    })
  }
}

export interface APIResponse {
  resCode: number
  resMsg: string
  result: any[]
}
