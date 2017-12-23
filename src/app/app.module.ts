import { NgModule, ErrorHandler } from '@angular/core'
import { HttpModule } from '@angular/http'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { Camera } from '@ionic-native/camera'
import { Network } from '@ionic-native/network'
import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { IonicStorageModule } from '@ionic/storage'
import { NgxQRCodeModule } from 'ngx-qrcode2'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'

import { reducers } from '../reducers/index'
import { MyApp } from './app.component'
import { environment } from '../environments/environment'
import { TabsPage } from '../pages/tabs/tabs'

import { LoginPageModule } from '../pages/login/login.module'
import { CustomerPageModule } from '../pages/customer/customer.module'
import { SettingsPageModule } from '../pages/settings/settings.module'
import { RecommendPageModule } from '../pages/recommend/recommend.module'
import { ExhibitorsPageModule } from '../pages/exhibitors/exhibitors.module'

import { OcrService } from '../providers/ocr.service'
import { SmsService } from '../providers/sms.service'
import { LoginService } from '../providers/login.service'
import { TenantService } from '../providers/tenant.service'
import { NativeService } from '../providers/native.service'
import { LoggerService } from '../providers/logger.service'
import { ErrorLoggerService } from '../providers/error-logger.service'
import { ApiErrorInterceptor } from '../providers/interceptor'

import * as Raven from 'raven-js'

Raven.config(
  'https://f0b725df74114d289e91d645d03b15cb@sentry.io/263353'
).install()

export class RavenErrorHandler implements ErrorHandler {
  handleError(err: any): void {
    Raven.captureException(err)
  }
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxQRCodeModule,
    LoginPageModule,
    CustomerPageModule,
    SettingsPageModule,
    RecommendPageModule,
    ExhibitorsPageModule,
    IonicModule.forRoot(MyApp),
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          maxAge: 42
        }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: ErrorHandler, useClass: RavenErrorHandler },
    OcrService,
    SmsService,
    LoginService,
    TenantService,
    NativeService,
    LoggerService,
    ErrorLoggerService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true }
  ]
})
export class AppModule {}
