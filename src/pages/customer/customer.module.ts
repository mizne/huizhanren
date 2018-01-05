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
} from './components/hz-collapse/hz-collapse.component'
import { HzListHeaderComponent } from './components/hz-list-header/hz-list-header.component'
import { HzListSearchComponent } from './components/hz-list-search/hz-list-search.component'
import { HzCustomerItemComponent } from './components/hz-customer-item/hz-customer-item.component'
import { HzFieldItemComponent } from './components/hz-field-item/hz-field-item.component'
import { HzFieldAddComponent } from './components/hz-field-add/hz-field-add.component'
import {
  HzCardDetailComponent,
  HzCardDetailFieldItemComponent
} from './components/hz-card-detail/hz-card-detail.component'
import {
  HzCardLogComponent,
} from './components/hz-card-log/hz-card-log.component'

import { HzHelpToggleLogComponent } from './components/helps/hz-help-toggle-log.component'

import {
  HzCardNotificationComponent,
  HzCardNotificationItemAddComponent,
  HzCardNotificationItemComponent
 } from './components/hz-card-notification/hz-card-notification.component'

import {
  HzCustomerManageComponent,
  HzCustomerManageHeader,
  HzCustomerManageContentItem,
  HzCustomerManageTemplate
} from './components/hz-customer-manage/hz-customer-manage.component'
import { HzCustomerSmsManageComponent } from './components/hz-customer-manage/hz-customer-sms-manage.component'
import { HzCustomerEmailManageComponent } from './components/hz-customer-manage/hz-customer-email-manage.component'
import { HzCustomerGroupManageComponent } from './components/hz-customer-manage/hz-customer-group-manage.component'

import { CustomerService } from './services/customer.service'
import { GroupService } from './services/group.service'
import { NotificationService } from './services/notification.service'

import { TimeRestPipe } from './pipes/time-rest.pipe'

import { ToCreateGroupModal } from './modals/to-create-group-modal.component'
import { ToCreateTemplateModal } from './modals/to-create-template-modal.component'
import { ToCreateLoggerModal } from './modals/to-create-logger-modal.component'
import { ToCreateNotificationModal } from './modals/to-create-notification-modal.component'
import { ToDeleteCustomerModal } from './modals/to-delete-customer-modal.component'
import { ToDeleteGroupModal } from './modals/to-delete-group-modal.component'
import { ToDiscardModal } from './modals/to-discard-modal.component'
import { ToEditCustomerGroupModal } from './modals/to-edit-customer-group-modal.component'
import { ToEditLoggerModal } from './modals/to-edit-logger-modal.component'
import { ToEditNotificationModal } from './modals/to-edit-notification-modal.component'
import { ToRenameGroupModal } from './modals/to-rename-group-modal.component'
import { ToSendSMSModal } from './modals/to-send-sms-modal.component'
import { ToSingleSendSMSModal } from './modals/to-single-send-sms-modal.component'

const modals = [
  ToCreateGroupModal,
  ToCreateTemplateModal,
  ToCreateLoggerModal,
  ToCreateNotificationModal,
  ToDeleteCustomerModal,
  ToDeleteGroupModal,
  ToDiscardModal,
  ToEditCustomerGroupModal,
  ToEditLoggerModal,
  ToEditNotificationModal,
  ToRenameGroupModal,
  ToSendSMSModal,
  ToSingleSendSMSModal,
]

const pipes = [
  TimeRestPipe,
]

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

    ...pipes,
    ...modals,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('customerModule', reducers),
    EffectsModule.forFeature([LoggerEffects, CustomerEffects, SmsEffects, GroupEffects, NotificationEffects]),
    IonicPageModule.forChild(CustomerPage)
  ],
  providers: [
    CustomerService,
    GroupService,
    NotificationService
  ],
  entryComponents: [
    ...modals,
  ]
})
export class CustomerPageModule {}
