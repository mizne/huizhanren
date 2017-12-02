import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginPage } from './login';

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { ExhibitionsEffects } from './effects/exhibitions.effects'
import { VerifyCodeEffects } from './effects/verify-code.effects'


@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    StoreModule.forFeature('login', reducers),
    EffectsModule.forFeature([ VerifyCodeEffects, ExhibitionsEffects ]),
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {}
