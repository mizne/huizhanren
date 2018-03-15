import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'
import { ExhibitorsPage } from './exhibitors'

import { ExhibitorGridComponent } from './components/exhibitor-grid/exhibitor-grid.component'
import { ExhibitorItemComponent } from './components/exhibitor-item/exhibitor-item.component'
import { ExhibitorMatcherGridComponent } from './components/exhibitor-matcher-grid/exhibitor-matcher-grid.component'
import { ExhibitorMatcherItemComponent } from './components/exhibitor-matcher-item/exhibitor-matcher-item.component'
import { ExhibitorDetailComponent } from './components/exhibitor-detail/exhibitor-detail.component'
import { HzExhibitorAbstractComponent } from './components/exhibitor-abstract/exhibitor-abstract.component'
import { HzExhibitorAnalysisComponent } from './components/exhibitor-analysis/exhibitor-analysis.component'
import { ExhibitorMatcherFilterComponent } from './components/matcher-filter/matcher-filter.component'

import { ToInviteExhibitorModal } from './modals/to-invite-exhibitor-modal/to-invite-exhibitor-modal.component'
import { ToShowProductModal } from './modals/to-show-product-modal/to-show-product-modal.component'
import { ToBatchAgreeMatchersModal } from './modals/to-batch-agree-matcher-modal/to-batch-agree-matcher-modal.component'
import { ToInviteExhibitorToMicroAppModal } from './modals/to-invite-exhibitor-to-micro-app-modal/to-invite-exhibitor-to-micro-app-modal.component'

import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { ExhibitorEffects } from './effects/exhibitor.effects'
import { ToDoMatcherEffects } from './effects/todo-matcher.effects'
import { CompleteMatcherEffects } from './effects/complete-matcher.effects'

import { ExhibitorService } from './services/exhibitor.service'
import { ExhibitorMatcherService } from './services/matcher.service'

import { ExhibitorMatcherStatusPipe } from './pipes/exhibitor-matcher-status.pipe'

const services = [ExhibitorService, ExhibitorMatcherService]
const effects = [ExhibitorEffects, ToDoMatcherEffects, CompleteMatcherEffects]
const pipes = [ExhibitorMatcherStatusPipe]
const modals = [
  ToInviteExhibitorModal,
  ToShowProductModal,
  ToBatchAgreeMatchersModal,
  ToInviteExhibitorToMicroAppModal
]

@NgModule({
  declarations: [
    ExhibitorsPage,
    ExhibitorGridComponent,
    ExhibitorItemComponent,
    ExhibitorMatcherGridComponent,
    ExhibitorMatcherItemComponent,
    ExhibitorDetailComponent,
    HzExhibitorAbstractComponent,
    HzExhibitorAnalysisComponent,
    ExhibitorMatcherFilterComponent,

    ...modals,
    ...pipes
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('exhibitorModule', reducers),
    EffectsModule.forFeature(effects),
    IonicPageModule.forChild(ExhibitorsPage)
  ],
  providers: [...services],
  entryComponents: [...modals]
})
export class ExhibitorsPageModule {}
