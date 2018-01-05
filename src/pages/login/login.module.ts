import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { LoginPage } from './login'

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { ExhibitionsEffects } from './effects/exhibitions.effects'
import { VerifyCodeEffects } from './effects/verify-code.effects'

import { DurationPipe } from './pipes/duration.pipe'

import { VerifyCodeModal } from './modals/verify-code-modal.component'
import { WelcomeModal } from './modals/welcome-modal.component'

import { SharedModule } from '../../shared/shared.module'

const pipes = [DurationPipe]

const modals = [VerifyCodeModal, WelcomeModal]

@NgModule({
  declarations: [LoginPage, ...modals, ...pipes],
  imports: [
    SharedModule,
    StoreModule.forFeature('loginModule', reducers),
    EffectsModule.forFeature([VerifyCodeEffects, ExhibitionsEffects]),
    IonicPageModule.forChild(LoginPage)
  ],
  entryComponents: [...modals]
})
export class LoginPageModule {}
