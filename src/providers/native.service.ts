import { Injectable } from '@angular/core'

import { Platform } from 'ionic-angular'

@Injectable()
export class NativeService {
  constructor(private platform: Platform) {}

  /**
   * 是否真机环境
   *
   * @returns {boolean}
   * @memberof NativeServiceProvider
   */
  isMobile(): boolean {
    return this.platform.is('mobile') && !this.platform.is('mobileweb')
  }

  /**
   * 是否android真机环境
   *
   * @returns {boolean}
   * @memberof NativeServiceProvider
   */
  isAndroid(): boolean {
    return this.isMobile() && this.platform.is('android')
  }

  /**
   * 是否ios真机环境
   *
   * @returns {boolean}
   * @memberof NativeServiceProvider
   */
  isIos(): boolean {
    return (
      this.isMobile() &&
      (this.platform.is('ios') ||
        this.platform.is('ipad') ||
        this.platform.is('iphone'))
    )
  }
}
