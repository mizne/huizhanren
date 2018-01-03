import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { UserManagementEffects } from './effects/user-management.effects'
import { OtherEffects } from './effects/other.effects'

import { UserService } from './services/user.service'
import { OtherService } from './services/other.service'

import { HzSettingItemComponent } from './hz-setting-item/hz-setting-item.component'

import { ToLogoutModal } from './modals/to-logout-modal/to-logout-modal.component'
import { ToDownloadModal } from './modals/to-download-modal/to-download-modal.component'
import { ToDeleteUserModal } from './modals/to-delete-user-modal/to-delete-user-modal.component'
import { ToAddUserModal } from './modals/to-add-user-modal/to-add-user-modal.component'

import {
  UserManagementPage,
  HzAdminItemComponent,
  HzUserItemComponent
} from './user-management/user-management'
import {
  SmsTemplatePage,
  SmsTemplateDetailComponent
} from './sms-template/sms-template'
import { HzAboutPage } from './about/about'

const modals = [
  ToLogoutModal,
  ToAddUserModal,
  ToDeleteUserModal,
  ToDownloadModal
]

const pages = [
  UserManagementPage,
  SmsTemplatePage,
  HzAboutPage,
]

@NgModule({
  declarations: [
    SettingsPage,
    HzSettingItemComponent,
    HzAdminItemComponent,
    HzUserItemComponent,
    SmsTemplateDetailComponent,
    ...modals,
    ...pages,
  ],
  imports: [
    StoreModule.forFeature('settings', reducers),
    EffectsModule.forFeature([UserManagementEffects, OtherEffects]),
    IonicPageModule.forChild(SettingsPage),
  ],
  providers: [
    UserService,
    OtherService
  ],
  entryComponents: [
    ...modals,
    ...pages,
  ]
})
export class SettingsPageModule {}
