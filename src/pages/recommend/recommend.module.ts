import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecommendPage } from './recommend';

import { RecommendGridComponent } from './components/recommend-grid/recommend-grid.component'
import { GridHeaderComponent } from './components/grid-header/grid-header.component'
import { RecommendFilterComponent } from './components/recommend-filter/recommend-filter.component'
import { RecommendDetailComponent } from './components/recommend-detail/recommend-detail.component'
import { MatcherFilterComponent } from './components/matcher-filter/matcher-filter.component'

import { SharedModule } from '../../shared/shared.module'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { RecommendEffects } from './effects/recommend.effects'
import { MatcherEffects } from './effects/matcher.effects'

import { RecommendService } from './services/recommend.service'
import { MatcherService } from './services/matcher.service'

const services = [
  RecommendService,
  MatcherService,
]

const effects = [
  RecommendEffects,
  MatcherEffects,
]

@NgModule({
  declarations: [
    RecommendPage,
    RecommendGridComponent,
    GridHeaderComponent,
    RecommendFilterComponent,
    RecommendDetailComponent,
    MatcherFilterComponent,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('recommendModule', reducers),
    EffectsModule.forFeature(effects),
    IonicPageModule.forChild(RecommendPage),
  ],
  providers: [
    ...services
  ]
})
export class RecommendPageModule {}
