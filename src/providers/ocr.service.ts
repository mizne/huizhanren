import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

/*
  Generated class for the OcrServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class OcrService {
  private url: string = 'http://dm-57.data.aliyun.com/rest/160601/ocr/ocr_business_card.json'
  constructor(public http: HttpClient) {}

  fetchCardInfo(base64Image): Observable<any> {
    return this.http
      .post(
        this.url,
        {
          inputs: [
            {
              image: {
                dataType: 50,
                dataValue: base64Image
              }
            }
          ]
        },
        {
          headers: new HttpHeaders({
            Authorization: 'APPCODE 6227ab3f96e84029bee837fc79d8dfb6'
          })
        }
      )
      .catch(this.handleError)
  }

  /**
   * http 错误处理
   *
   * @private
   * @param {*} error
   * @returns {Observable<any>}
   * @memberof OrderProvider
   */
  private handleError(error: any): Observable<any> {
    console.error(error)
    return Observable.throw(error)
  }
}
