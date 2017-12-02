import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExhibitorsPage } from './exhibitors';

// import { StoreModule } from '@ngrx/store'
// import { EffectsModule } from '@ngrx/effects'
// import { reducers } from './reducers'
// import { UserManagementEffects } from './effects/user-management.effects'
// import { OtherEffects } from './effects/other.effects'

// import { UserService } from './services/user.service'
// import { OtherService } from './services/other.service'

const services = [

]

@NgModule({
  declarations: [
    ExhibitorsPage,
  ],
  imports: [
    // StoreModule.forFeature('settings', reducers),
    // EffectsModule.forFeature([UserManagementEffects, OtherEffects]),
    IonicPageModule.forChild(ExhibitorsPage),
  ],
  providers: [
    ...services
  ]
})
export class ExhibitorsPageModule {}
