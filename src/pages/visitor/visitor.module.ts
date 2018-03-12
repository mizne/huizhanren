import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { VisitorPage } from './visitor'

import { VisitorGridComponent } from './components/visitor-grid/visitor-grid.component'
import { VisitorDetailComponent } from './components/visitor-detail/visitor-detail.component'
import { VisitorItemComponent } from './components/visitor-item/visitor-item.component'
import { HzCustomerAbstractComponent } from './components/customer-abstract/customer-abstract.component'
import { HzCustomerStatusComponent } from './components/customer-status/customer-status.component'
import { HzCustomerPortrayComponent } from './components/customer-portray/customer-portray.component'
import { HzMatcherFilterComponent } from './components/matcher-filter/matcher-filter.component'

import { ToInviteCustomerModal } from './modals/to-invite-customer-modal/to-invite-customer-modal.component'
import { ToCancelMatcherModal } from './modals/to-cancel-matcher-modal/to-cancel-matcher-modal.component'
import { ToAgreeMatcherModal } from './modals/to-agree-matcher-modal/to-agree-matcher-modal.component'
import { ToRefuseMatcherModal } from './modals/to-refuse-matcher-modal/to-refuse-matcher-modal.component'

import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { VisitorEffects } from './effects/visitor.effects'
import { MatcherEffects } from './effects/matcher.effects'

import { CustomerMatcherStatusPipe } from './pipes/matcher-status.pipe'
import { CustomerNamePrivacyPipe } from './pipes/name-privacy.pipe'
import { CustomerCompanyPrivacyPipe } from './pipes/company-privacy.pipe'

import { VisitorService } from './services/visitor.service'
import { VisitorMatcherService } from './services/matcher.service'

const services = [VisitorService, VisitorMatcherService]
const effects = [VisitorEffects, MatcherEffects]
const pipes = [
  CustomerMatcherStatusPipe,
  CustomerNamePrivacyPipe,
  CustomerCompanyPrivacyPipe
]
const modals = [
  ToInviteCustomerModal,
  ToCancelMatcherModal,
  ToAgreeMatcherModal,
  ToRefuseMatcherModal
]

@NgModule({
  declarations: [
    VisitorPage,
    VisitorGridComponent,
    VisitorDetailComponent,
    VisitorItemComponent,
    HzCustomerAbstractComponent,
    HzCustomerStatusComponent,
    HzCustomerPortrayComponent,
    HzMatcherFilterComponent,

    ...modals,
    ...pipes
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('visitorModule', reducers),
    EffectsModule.forFeature(effects),
    IonicPageModule.forChild(VisitorPage)
  ],
  providers: [...services],
  entryComponents: [...modals]
})
export class VisitorPageModule {}
