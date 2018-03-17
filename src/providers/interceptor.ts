import { Injectable } from '@angular/core'
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http'
import { ToastController } from 'ionic-angular'
import { Observable } from 'rxjs/Observable'

export const HOST = 'http://huizhanren.xiaovbao.cn'
// export const HOST = '//192.168.0.129:3012'
// export const HOST = '//192.168.1.6:3012'

export const API_VERSION = 'v2'
export const BASE_URL = `${HOST}/${API_VERSION}`
export const TIME_OUT = 2e4

@Injectable()
export class ApiErrorInterceptor implements HttpInterceptor {
  private url: string = BASE_URL

  constructor(private toastCtrl: ToastController) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next
      .handle(
        req.clone({
          url: /^http/.test(req.url) ? req.url : `${this.url}${req.url}`
        })
      )
      .timeout(TIME_OUT)
      .do({
        next: (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            if (event.body && event.url.indexOf(HOST) >= 0) {
              if (event.body.resCode !== 0) {
                console.error(`API Error; ${event.body.resMsg}`)
                throw new Error(event.body.resMsg)
              }
            }
          }
        },
        error: e => {
          if (e.name === 'TimeoutError') {
            this.toastCtrl
              .create({
                message: '服务器繁忙，请稍候重试',
                duration: 3e3,
                position: 'top'
              })
              .present()
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
