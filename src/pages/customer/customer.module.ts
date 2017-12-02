import { NgModule } from '@angular/core'
import { IonicPageModule } from 'ionic-angular'

import { SharedModule } from '../../shared/shared.module'

import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { reducers } from './reducers'
import { LoggerEffects } from './effects/logger.effects'
import { CustomerEffects } from './effects/customer.effects'
import { SmsEffects } from './effects/sms.effects'
import { GroupEffects } from './effects/group.effects'
import { NotificationEffects } from './effects/notification.effects'

import { CustomerPage } from './customer'

import {
  HzCollapseComponent,
  HzCollapsesetComponent
} from './hz-collapse/hz-collapse.component'
import { HzListHeaderComponent } from './hz-list-header/hz-list-header.component'
import { HzListSearchComponent } from './hz-list-search/hz-list-search.component'
import { HzCustomerItemComponent } from './hz-customer-item/hz-customer-item.component'
import { HzFieldItemComponent } from './hz-field-item/hz-field-item.component'
import { HzFieldAddComponent } from './hz-field-add/hz-field-add.component'
import {
  HzCardDetailComponent,
  HzCardDetailFieldItemComponent
} from './hz-card-detail/hz-card-detail.component'
import {
  HzCardLogComponent,
  HzCardLogItemAddComponent,
  HzCardLogItemComponent
} from './hz-card-log/hz-card-log.component'

import { HzHelpToggleLogComponent } from './helps/hz-help-toggle-log.component'

import {
  HzCardNotificationComponent,
  HzCardNotificationItemAddComponent,
  HzCardNotificationItemComponent
 } from './hz-card-notification/hz-card-notification.component'

import {
  HzCustomerManageComponent,
  HzCustomerManageHeader,
  HzCustomerManageContentItem,
  HzCustomerManageTemplate
} from './hz-customer-manage/hz-customer-manage.component'
import { HzCustomerSmsManageComponent } from './hz-customer-manage/hz-customer-sms-manage.component'
import { HzCustomerEmailManageComponent } from './hz-customer-manage/hz-customer-email-manage.component'
import { HzCustomerGroupManageComponent } from './hz-customer-manage/hz-customer-group-manage.component'

import { CustomerService } from './services/customer.service'
import { GroupService } from './services/group.service'
import { NotificationService } from './services/notification.service'

import { GroupPipe } from '../../pipes/customer-group.pipe'
import { TimeRestPipe } from '../../pipes/time-rest.pipe'

@NgModule({
  declarations: [
    CustomerPage,

    HzCollapseComponent,
    HzCollapsesetComponent,
    HzListHeaderComponent,
    HzListSearchComponent,

    HzCustomerItemComponent,
    HzFieldItemComponent,
    HzFieldAddComponent,

    HzCardDetailComponent,
    HzCardLogComponent,
    HzCardDetailFieldItemComponent,
    HzCardLogItemAddComponent,
    HzCardLogItemComponent,

    HzCardNotificationComponent,
    HzCardNotificationItemAddComponent,
    HzCardNotificationItemComponent,

    HzCustomerManageComponent,
    HzCustomerSmsManageComponent,
    HzCustomerEmailManageComponent,
    HzCustomerGroupManageComponent,
    HzCustomerManageHeader,
    HzCustomerManageContentItem,
    HzCustomerManageTemplate,

    HzHelpToggleLogComponent,

    GroupPipe,
    TimeRestPipe,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('customer', reducers),
    EffectsModule.forFeature([LoggerEffects, CustomerEffects, SmsEffects, GroupEffects, NotificationEffects]),
    IonicPageModule.forChild(CustomerPage)
  ],
  providers: [
    CustomerService,
    GroupService,
    NotificationService
  ]
})
export class CustomerPageModule {}
