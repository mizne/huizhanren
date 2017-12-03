import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { ExhibitorsPage } from './exhibitors'

import { ExhibitorGridComponent } from './components/exhibitor-grid/exhibitor-grid.component'
import { ExhibitorDetailComponent } from './components/exhibitor-detail/exhibitor-detail.component'
import { HzCustomerAbstractComponent } from './components/customer-abstract/customer-abstract.component'
import { HzCustomerStatusComponent } from './components/customer-status/customer-status.component'
import { HzCustomerPortrayComponent } from './components/customer-portray/customer-portray.component'
import { HzMatcherFilterComponent } from './components/matcher-filter/matcher-filter.component'

import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { ExhibitorEffects } from './effects/exhibitor.effects'
import { MatcherEffects } from './effects/matcher.effects'

import { ExhibitorService } from './services/exhibitor.service'
import { MatcherService } from './services/matcher.service'

const services = [ExhibitorService, MatcherService]

const effects = [ExhibitorEffects, MatcherEffects]

@NgModule({
  declarations: [
    ExhibitorsPage,
    ExhibitorGridComponent,
    ExhibitorDetailComponent,
    HzCustomerAbstractComponent,
    HzCustomerStatusComponent,
    HzCustomerPortrayComponent,
    HzMatcherFilterComponent,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('exhibitorsModule', reducers),
    EffectsModule.forFeature(effects),
    IonicPageModule.forChild(ExhibitorsPage)
  ],
  providers: [...services]
})
export class ExhibitorsPageModule {}
