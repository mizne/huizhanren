import { NgModule, ErrorHandler } from '@angular/core'
import { HttpModule } from '@angular/http'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular'
import { Camera } from '@ionic-native/camera'
import { Network } from '@ionic-native/network'
import { IonicStorageModule } from '@ionic/storage'

import { NgxQRCodeModule } from 'ngx-qrcode2'

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { reducers } from '../reducers/index'

import { MyApp } from './app.component'
import { environment } from '../environments/environment'

import { InteractivePage } from '../pages/interactive/interactive'
import { ContactPage } from '../pages/contact/contact'
import { HomePage } from '../pages/home/home'
import { TabsPage } from '../pages/tabs/tabs'
import { ServicePage } from '../pages/service/service'
import { UserManagementPage, HzAdminItemComponent, HzUserItemComponent } from '../pages/settings/user-management/user-management'
import { SmsTemplatePage, SmsTemplateDetailComponent } from '../pages/settings/sms-template/sms-template'
import { HzAboutPage } from '../pages/settings/about/about'


import { VerifyCodeModal } from '../pages/login/verify-code-modal.component'
import { WelcomeModal } from '../pages/login/welcome-modal.component'
import { ToCreateLoggerModal } from '../pages/customer/modals/to-create-logger-modal.component'
import { ToCreateNotificationModal } from '../pages/customer/modals/to-create-notification-modal.component'
import { ToEditNotificationModal } from '../pages/customer/modals/to-edit-notification-modal.component'
import { ToEditLoggerModal } from '../pages/customer/modals/to-edit-logger-modal.component'
import { ToDeleteCustomerModal } from '../pages/customer/modals/to-delete-customer-modal.component'
import { CreateGroupModal } from '../pages/customer/modals/to-create-group-modal.component'
import { ToEditCustomerGroupModal } from '../pages/customer/modals/to-edit-customer-group-modal.component'
import { ToDiscardModal } from '../pages/customer/modals/to-discard-modal.component'
import { ToSendSMSModal } from '../pages/customer/modals/to-send-sms-modal.component'
import { ToSingleSendSMSModal } from '../pages/customer/modals/to-single-send-sms-modal.component'
import { ToRenameGroupModal } from '../pages/customer/modals/to-rename-group-modal.component'
import { ToDeleteGroupModal } from '../pages/customer/modals/to-delete-group-modal.component'


import { LogoutModal } from '../pages/settings/logout-modal.component'
import { ToAddUserModal } from '../pages/settings/to-add-user-modal.component'
import { ToDeleteUserModal } from '../pages/settings/to-delete-user-modal.component'
import { ToDownloadModal } from '../pages/settings/to-download-modal.component'

import { LoginPageModule } from '../pages/login/login.module'
import { CustomerPageModule } from '../pages/customer/customer.module'
import { SettingsPageModule } from '../pages/settings/settings.module'

import { RecommendPageModule } from '../pages/recommend/recommend.module'
import { ExhibitorsPageModule } from '../pages/exhibitors/exhibitors.module'

import { StatusBar } from '@ionic-native/status-bar'
import { SplashScreen } from '@ionic-native/splash-screen'
import { OcrService } from '../providers/ocr.service'
import { SmsService } from '../providers/sms.service'
import { LoginService } from '../providers/login.service'
import { TenantService } from '../providers/tenant.service'
import { NativeService } from '../providers/native.service'
import { LoggerService } from '../providers/logger.service'
import { ApiErrorInterceptor } from '../providers/interceptor'

import { DurationPipe } from '../pipes/duration.pipe'

@NgModule({
  declarations: [
    MyApp,
    InteractivePage,
    ContactPage,
    HomePage,
    TabsPage,
    ServicePage,
    UserManagementPage,
    HzAboutPage,
    SmsTemplatePage,
    HzAdminItemComponent,
    HzUserItemComponent,
    SmsTemplateDetailComponent,
    VerifyCodeModal,
    WelcomeModal,
    ToCreateLoggerModal,
    ToCreateNotificationModal,
    ToEditNotificationModal,
    ToEditLoggerModal,
    CreateGroupModal,
    ToEditCustomerGroupModal,
    ToDiscardModal,
    ToSendSMSModal,
    ToSingleSendSMSModal,
    ToRenameGroupModal,
    ToDeleteGroupModal,
    ToDeleteCustomerModal,
    LogoutModal,
    ToAddUserModal,
    ToDeleteUserModal,
    ToDownloadModal,
    DurationPipe
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
    environment.production ?
    [] :
    StoreDevtoolsModule.instrument({
      maxAge: 42
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    InteractivePage,
    ContactPage,
    HomePage,
    TabsPage,
    ServicePage,
    UserManagementPage,
    HzAboutPage,
    SmsTemplatePage,
    VerifyCodeModal,
    WelcomeModal,
    ToCreateLoggerModal,
    ToCreateNotificationModal,
    ToCreateNotificationModal,
    ToEditNotificationModal,
    ToEditLoggerModal,
    CreateGroupModal,
    ToEditCustomerGroupModal,
    ToDiscardModal,
    ToSendSMSModal,
    ToSingleSendSMSModal,
    ToRenameGroupModal,
    ToDeleteGroupModal,
    ToDeleteCustomerModal,
    LogoutModal,
    ToAddUserModal,
    ToDeleteUserModal,
    ToDownloadModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Network,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    OcrService,
    SmsService,
    LoginService,
    TenantService,
    NativeService,
    LoggerService,
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true }
  ]
})
export class AppModule {}
