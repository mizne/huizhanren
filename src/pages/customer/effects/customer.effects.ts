import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'

import {
  ModalController,
  ToastController,
  LoadingController
} from 'ionic-angular'

import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store'
import {
  State,
  getCustomers,
  getFields1,
  getCardInfo,
  getCustomerPageStatus,
  getShowDetailCustomerId,
  getShowDetailGroupId,
  getSelectedCustomers,
  getCardBehindImg
} from '../reducers'
import { isAdmin, getSelectedExhibitionId } from '../../login/reducers'

import * as fromCustomer from '../actions/customer.action'
import * as fromCard from '../actions/card.action'

import { CustomerService } from '../services/customer.service'
import { LoggerService } from '../../../providers/logger.service'

import { ToDeleteCustomerModal } from '../modals/to-delete-customer-modal.component'
import { ToDiscardModal } from '../modals/to-discard-modal.component'
import { ToEditCustomerGroupModal } from '../modals/to-edit-customer-group-modal.component'

import { Customer } from '../models/customer.model'
import { createCustomerFromFields } from '../models/card.model'

@Injectable()
export class CustomerEffects {
  @Effect()
  initial$ = this.actions$.ofType(fromCustomer.INITIAL).mergeMap(() => {
    const loadingCtrl = this.loadCtrl.create({
      content: '获取客户信息中...',
      spinner: 'bubbles'
    })

    loadingCtrl.present()
    return this.customerService
      .initialFetchAll()
      .map(res => {
        loadingCtrl.dismiss()
        return new fromCustomer.InitialSuccessAction(res)
      })
      .catch(() => {
        loadingCtrl.dismiss()
        return Observable.of(new fromCustomer.InitialFailureAction())
      })
  })

  @Effect({ dispatch: false })
  initialSuccess$ = this.actions$
    .ofType(fromCustomer.INITIAL_SUCCESS)
    .do(() => {
      // this.toastCtrl.create({
      //   message: '初始化获取客户信息成功',
      //   duration: 3e3,
      //   position: 'top'
      // }).present()
    })

  @Effect({ dispatch: false })
  initialFailure$ = this.actions$
    .ofType(fromCustomer.INITIAL_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '初始化获取客户信息失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  preCreate$ = this.actions$
    .ofType(fromCustomer.PRE_CREATE)
    .withLatestFrom(this.store.select(getFields1))
    .withLatestFrom(
      this.store.select(getCustomerPageStatus),
      ([_, fields1], pageStatus) => ({ fields1, pageStatus })
    )
    .map(({ fields1, pageStatus }) => {
      if (!fields1[0].value) {
        return new fromCustomer.CancelCreateAction()
      }
      if (pageStatus === 'createable') {
        return new fromCustomer.CreateAction()
      }
      if (pageStatus === 'editable') {
        return new fromCustomer.EditCustomerAction()
      }
    })

  @Effect({ dispatch: false })
  cancelCreate$ = this.actions$.ofType(fromCustomer.CANCEL_CREATE).do(() => {
    this.toastCtrl
      .create({
        message: '姓名不能为空',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect()
  create$ = this.actions$
    .ofType(fromCustomer.CREATE)
    .withLatestFrom(this.store.select(getCardInfo))
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ([_, cardInfo], exhibitionId) => ({ cardInfo, exhibitionId })
    )
    .mergeMap(({ cardInfo, exhibitionId }) => {
      const loadingCtrl = this.loadCtrl.create({
        content: '保存中...',
        spinner: 'bubbles'
      })

      loadingCtrl.present()
      const customer = createCustomerFromFields({
        fields1: cardInfo.fields1,
        fields2: cardInfo.fields2
      })

      return Observable.forkJoin(
        this.customerService.uploadCardImage(cardInfo.cardImg),
        this.customerService.uploadCardImage(cardInfo.cardBehindImg)
      )
        .mergeMap(([path, behindPath]) => {
          return this.customerService.createCustomer(
            {
              ...customer,
              imageUrl: path,
              imageBehindUrl: behindPath
            },
            exhibitionId
          )
        })
        .concatMap(res => {
          loadingCtrl.dismiss()
          return [
            new fromCustomer.CreateSuccessAction(res),
            new fromCustomer.CreateSysLoggerAction({
              log: {
                level: 'sys',
                content: '系统: 扫描名片并保存成功'
              },
              customerId: res.RecordId
            }),
            new fromCustomer.FetchAllAction(),
            new fromCustomer.ToListableStatusAction()
          ]
        })
        .catch(error => {
          loadingCtrl.dismiss()
          return Observable.of(new fromCustomer.CreateFailureAction(error))
        })
    })

  @Effect()
  createSysLogger$ = this.actions$
    .ofType(fromCustomer.CREATE_SYS_LOGGER)
    .map((action: fromCustomer.CreateSysLoggerAction) => action.payload)
    .mergeMap(({ log, customerId }) => {
      return this.loggerService
        .createLog(log, customerId)
        .map(() => new fromCustomer.CreateSysLoggerSuccessAction())
        .catch(() => Observable.of(new fromCustomer.CreateSysLoggerFailureAction()))
    })

  @Effect({ dispatch: false })
  createSuccess$ = this.actions$.ofType(fromCustomer.CREATE_SUCCESS).do(() => {
    this.toastCtrl
      .create({
        message: '保存客户成功',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect({ dispatch: false })
  createFailure$ = this.actions$.ofType(fromCustomer.CREATE_FAILURE).do(() => {
    this.toastCtrl
      .create({
        message: '保存客户失败',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect()
  fetchAll$ = this.actions$.ofType(fromCustomer.FETCH_ALL).mergeMap(() => {
    return this.customerService
      .fetchAllCustomer()
      .map(customers => new fromCustomer.FetchAllSuccessAction(customers))
      .catch(error => Observable.of(new fromCustomer.FetchAllFailureAction(error)))
  })

  @Effect({ dispatch: false })
  fetchAllFailure$ = this.actions$
    .ofType(fromCustomer.FETCH_ALL_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '获取客户列表失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  preBatchEditGroup$ = this.actions$
    .ofType(fromCustomer.PRE_BATCH_EDIT_GROUP)
    .map((action: fromCustomer.PreBatchEditGroupAction) => action.groupId)
    .withLatestFrom(this.store.select(getSelectedCustomers))
    .map(([groupId, selectedCustomers]) => {
      if (selectedCustomers.length === 0) {
        return new fromCustomer.CancelBatchEditGroupAction()
      } else {
        return new fromCustomer.BatchEditGroupAction(groupId)
      }
    })

  @Effect({ dispatch: false })
  cancelBatchEditGroup$ = this.actions$
    .ofType(fromCustomer.CANCEL_BATCH_EDIT_GROUP)
    .do(() => {
      this.toastCtrl
        .create({
          message: '您还没有选择客户呢',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  batchEditGroup$ = this.actions$
    .ofType(fromCustomer.BATCH_EDIT_GROUP)
    .map((action: fromCustomer.BatchEditGroupAction) => action.groupId)
    .withLatestFrom(this.store.select(getSelectedCustomers))
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ([groupId, customers], exhibitionId) => ({
        customers,
        groupId,
        exhibitionId
      })
    )
    .mergeMap(({ customers, groupId, exhibitionId }) => {
      return this.customerService
        .batchEditCustomerGroupId(customers, groupId, exhibitionId)
        .concatMap(() => [
          new fromCustomer.BatchEditGroupSuccessAction(),
          new fromCustomer.ToListableStatusAction(),
          new fromCustomer.FetchAllAction()
        ])
        .catch(() => Observable.of(new fromCustomer.BatchEditGroupFailureAction()))
    })

  @Effect({ dispatch: false })
  batchEditGroupSuccess$ = this.actions$
    .ofType(fromCustomer.BATCH_EDIT_GROUP_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '批量编辑客户标签成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  batchEditGroupFailure$ = this.actions$
    .ofType(fromCustomer.BATCH_EDIT_GROUP_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '批量编辑客户标签失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  toSingleEditGroup$ = this.actions$
    .ofType(fromCustomer.TO_SINGLE_EDIT_GROUP)
    .do(() => {
      this.modalCtrl.create(ToEditCustomerGroupModal).present()
    })

  @Effect()
  singleEditGroup$ = this.actions$
    .ofType(fromCustomer.SINGLE_EDIT_GROUP)
    .withLatestFrom(this.store.select(getCustomers))
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ([action, customers], customerId) => [action, customers, customerId]
    )
    .map(([action, customers, customerId]) => {
      const groupId = (action as fromCustomer.SingleEditGroupAction).groupId
      const customer = (customers as Customer[]).find(e => e.id === customerId)
      return { groupId, customer }
    })
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ({ groupId, customer }, exhibitionId) => ({
        groupId,
        customer,
        exhibitionId
      })
    )
    .mergeMap(({ groupId, customer, exhibitionId }) => {
      return this.customerService
        .singleEditCustomerGroupId(customer, groupId, exhibitionId)
        .concatMap(() => {
          return [
            new fromCustomer.SingleEditGroupSuccessAction(),
            new fromCustomer.ToListableStatusAction(),
            new fromCustomer.FetchAllAction()
          ]
        })
        .catch(() => Observable.of(new fromCustomer.SingleEditGroupFailureAction()))
    })

  @Effect({ dispatch: false })
  singleEditGroupSuccess$ = this.actions$
    .ofType(fromCustomer.SINGLE_EDIT_GROUP_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '编辑客户标签成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  singleEditGroupFailure$ = this.actions$
    .ofType(fromCustomer.SINGLE_EDIT_GROUP_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '编辑客户标签失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  preDelete$ = this.actions$
    .ofType(fromCustomer.PRE_DELETE)
    .withLatestFrom(this.store.select(getCustomerPageStatus))
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ([_, pageStatus], customerId) => ({ pageStatus, customerId })
    )
    .withLatestFrom(
      this.store.select(getShowDetailGroupId),
      ({ pageStatus, customerId }, groupId) => ({
        pageStatus,
        customerId,
        groupId
      })
    )
    .map(({ pageStatus, customerId, groupId }) => {
      if (pageStatus === 'editable') {
        return new fromCustomer.ToDetailableStatusAction({
          groupId,
          customerId
        })
      }
      if (pageStatus === 'createable') {
        return new fromCustomer.ToDiscardAction()
      }
    })

  @Effect({ dispatch: false })
  toDelete$ = this.actions$
    .ofType(fromCustomer.TO_DELETE)
    .map((action: fromCustomer.ToDeleteAction) => action.multi)
    .withLatestFrom(this.store.select(isAdmin))
    .withLatestFrom(
      this.store.select(getSelectedCustomers),
      ([multi, isAdmin], selectedCustomers) => ({
        multi,
        isAdmin,
        selectedCustomers
      })
    )
    .do(({ multi, isAdmin, selectedCustomers }) => {
      if (!isAdmin) {
        return this.toastCtrl
          .create({
            message: '您还不是管理员',
            duration: 3e3,
            position: 'top'
          })
          .present()
      }

      if (multi && selectedCustomers.length === 0) {
        return this.toastCtrl
          .create({
            message: '您还没有选择客户',
            duration: 3e3,
            position: 'top'
          })
          .present()
      }

      this.modalCtrl.create(ToDeleteCustomerModal, { multi }).present()
    })

  @Effect()
  ensureDelete$ = this.actions$
    .ofType(fromCustomer.ENSURE_DELETE)
    .map((action: fromCustomer.EnsureDeleteAction) => action.multi)
    .withLatestFrom(
      this.store.select(getSelectedCustomers).map(e => e.map(f => f.id))
    )
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ([multi, customerIds], showDetailCustomerId) => ({
        multi,
        customerIds,
        showDetailCustomerId
      })
    )
    .mergeMap(({ multi, customerIds, showDetailCustomerId }) => {
      return (multi
        ? this.customerService.batchDeleteCustomer(customerIds)
        : this.customerService.singleDeleteCustomer(showDetailCustomerId)
      )
        .concatMap(() => [
          new fromCustomer.DeleteSuccessAction(),
          new fromCustomer.ToListableStatusAction(),
          new fromCustomer.FetchAllAction()
        ])
        .catch(() => Observable.of(new fromCustomer.DeleteFailureAction()))
    })

  @Effect({ dispatch: false })
  deleteSuccess$ = this.actions$.ofType(fromCustomer.DELETE_SUCCESS).do(() => {
    this.toastCtrl
      .create({
        message: '删除客户成功',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect({ dispatch: false })
  deleteFailure$ = this.actions$.ofType(fromCustomer.DELETE_FAILURE).do(() => {
    this.toastCtrl
      .create({
        message: '删除客户失败',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect({ dispatch: false })
  toDiscard$ = this.actions$.ofType(fromCustomer.TO_DISCARD).do(() => {
    this.modalCtrl.create(ToDiscardModal).present()
  })

  @Effect()
  ensureDiscard$ = this.actions$
    .ofType(fromCustomer.ENSURE_DISCARD)
    .map(() => new fromCustomer.ToListableStatusAction())

  @Effect()
  editCustomer$ = this.actions$
    .ofType(fromCustomer.EDIT_CUSTOMER)
    .withLatestFrom(this.store.select(getCardInfo))
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ([_, cardInfo], customerId) => ({ cardInfo, customerId })
    )
    .withLatestFrom(
      this.store.select(getCardBehindImg),
      ({ cardInfo, customerId }, cardBehindImg) => ({
        cardInfo,
        customerId,
        cardBehindImg
      })
    )
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ({ cardInfo, customerId, cardBehindImg }, exhibitionId) => ({
        cardInfo,
        customerId,
        cardBehindImg,
        exhibitionId
      })
    )
    .mergeMap(({ cardInfo, customerId, cardBehindImg, exhibitionId }) => {
      const customer = createCustomerFromFields({
        fields1: cardInfo.fields1,
        fields2: cardInfo.fields2
      })

      const isEditCardBehindImg = /base64/.test(cardBehindImg)
      const loadingCtrl = this.loadCtrl.create({
        content: '保存中...',
        spinner: 'bubbles'
      })

      loadingCtrl.present()

      return (isEditCardBehindImg
        ? this.customerService.uploadCardImage(cardBehindImg).mergeMap(path =>
            this.customerService.editCustomer(
              {
                ...customer,
                imageBehindUrl: path
              },
              customerId,
              exhibitionId
            )
          )
        : this.customerService.editCustomer(customer, customerId, exhibitionId)
      )
        .concatMap(() => {
          loadingCtrl.dismiss()
          return [
            new fromCustomer.EditCustomerSuccessAction(),
            new fromCustomer.ToListableStatusAction(),
            new fromCustomer.FetchAllAction()
          ]
        })
        .catch(() => {
          loadingCtrl.dismiss()
          return Observable.of(new fromCustomer.EditCustomerFailureAction())
        })
    })

  @Effect({ dispatch: false })
  editCustomerSuccess$ = this.actions$
    .ofType(fromCustomer.EDIT_CUSTOMER_SUCCESS)
    .do(() => {
      this.toastCtrl
        .create({
          message: '编辑客户成功',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect({ dispatch: false })
  editCustomerFailure$ = this.actions$
    .ofType(fromCustomer.EDIT_CUSTOMER_FAILURE)
    .do(() => {
      this.toastCtrl
        .create({
          message: '编辑客户失败',
          duration: 3e3,
          position: 'top'
        })
        .present()
    })

  @Effect()
  toEditableStatus$ = this.actions$
    .ofType(fromCustomer.TO_EDITABLE_STATUS)
    .withLatestFrom(this.store.select(getCustomers))
    .withLatestFrom(
      this.store.select(getShowDetailCustomerId),
      ([_, customers], customerId) => ({ customers, customerId })
    )
    .map(({ customers, customerId }) => {
      return new fromCard.InitialEditCardAction(
        customers.find(e => e.id === customerId)
      )
    })

  @Effect()
  removeCustomerGroupId$ = this.actions$
    .ofType(fromCustomer.REMOVE_CUSTOMER_GROUPID)
    .map((action: fromCustomer.RemoveCustomerGroupIdAction) => action.groupId)
    .withLatestFrom(this.store.select(getCustomers), (groupId, customers) => ({
      groupId,
      customers
    }))
    .withLatestFrom(
      this.store.select(getSelectedExhibitionId),
      ({ groupId, customers }, exhibitionId) => ({
        groupId,
        customers,
        exhibitionId
      })
    )
    .mergeMap(({ groupId, customers, exhibitionId }) => {
      return this.customerService
        .removeCustomerGroupId(customers, groupId, exhibitionId)
        .concatMap(() => [
          new fromCustomer.RemoveCustomerGroupIdSuccessAction(),
          new fromCustomer.FetchAllAction()
        ])
        .catch(() => Observable.of(new fromCustomer.RemoveCustomerGroupIdFailureAction()))
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private customerService: CustomerService,
    private loggerService: LoggerService,
    private loadCtrl: LoadingController,
    private store: Store<State>
  ) {}
}
