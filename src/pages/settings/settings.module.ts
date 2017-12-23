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

import { LogoutModal } from './modals/logout-modal.component'
import { ToAddUserModal } from './modals/to-add-user-modal.component'
import { ToDeleteUserModal } from './modals/to-delete-user-modal.component'
import { ToDownloadModal } from './modals/to-download-modal.component'

const modals = [
  LogoutModal,
  ToAddUserModal,
  ToDeleteUserModal,
  ToDownloadModal
]

@NgModule({
  declarations: [
    SettingsPage,
    HzSettingItemComponent,
    ...modals,
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
  ]
})
export class SettingsPageModule {}
