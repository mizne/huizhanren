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


@NgModule({
  declarations: [
    SettingsPage,
    HzSettingItemComponent,
  ],
  imports: [
    StoreModule.forFeature('settings', reducers),
    EffectsModule.forFeature([UserManagementEffects, OtherEffects]),
    IonicPageModule.forChild(SettingsPage),
  ],
  providers: [
    UserService,
    OtherService
  ]
})
export class SettingsPageModule {}
