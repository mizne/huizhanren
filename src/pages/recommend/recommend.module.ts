import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { RecommendPage } from './recommend'

import { RecommendGridComponent } from './components/recommend-grid/recommend-grid.component'
import { RecommendDetailComponent } from './components/recommend-detail/recommend-detail.component'
import { HzCustomerAbstractComponent } from './components/customer-abstract/customer-abstract.component'
import { HzCustomerStatusComponent } from './components/customer-status/customer-status.component'
import { HzCustomerPortrayComponent } from './components/customer-portray/customer-portray.component'
import { HzMatcherFilterComponent } from './components/matcher-filter/matcher-filter.component'

import { ToInviteCustomerModal } from './modals/to-invite-customer-modal/to-invite-customer-modal.component'

import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { RecommendEffects } from './effects/recommend.effects'
import { MatcherEffects } from './effects/matcher.effects'

import { CustomerMatcherStatusPipe } from './pipes/matcher-status.pipe'

import { RecommendService } from './services/recommend.service'
import { MatcherService } from './services/matcher.service'

const services = [RecommendService, MatcherService]

const effects = [RecommendEffects, MatcherEffects]

const pipes = [CustomerMatcherStatusPipe]

@NgModule({
  declarations: [
    RecommendPage,
    RecommendGridComponent,
    RecommendDetailComponent,
    HzCustomerAbstractComponent,
    HzCustomerStatusComponent,
    HzCustomerPortrayComponent,
    HzMatcherFilterComponent,

    ToInviteCustomerModal,
    ...pipes
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('recommendModule', reducers),
    EffectsModule.forFeature(effects),
    IonicPageModule.forChild(RecommendPage)
  ],
  providers: [...services],
  entryComponents: [ToInviteCustomerModal]
})
export class RecommendPageModule {}
