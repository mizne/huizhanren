import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable';

import {
  ModalController,
  ToastController,
} from 'ionic-angular'

import { Store } from '@ngrx/store'
import { State, getSelectedExhibitionId } from '../../login/reducers'

import * as fromGroup from '../actions/group.action'
import * as fromCustomer from '../actions/customer.action'
import { GroupService } from '../services/group.service'
import { ToCreateGroupModal } from '../modals/to-create-group-modal.component'
import { ToRenameGroupModal } from '../modals/to-rename-group-modal.component'
import { ToDeleteGroupModal } from '../modals/to-delete-group-modal.component'

@Injectable()
export class GroupEffects {
  @Effect()
  toCreate$ = this.actions$.ofType(fromGroup.TO_CREATE).switchMap(() => {
    return Observable.fromPromise(
      new Promise((res, _) => {
        const createGroupModal = this.modalCtrl.create(ToCreateGroupModal)
        createGroupModal.onDidDismiss(groupName => {
          res(groupName)
        })
        createGroupModal.present()
      })
    ).map((groupName: string) => {
      if (groupName) {
        return new fromGroup.CreateAction(groupName)
      } else {
        return new fromGroup.CancelCreateAction()
      }
    })
  })

  @Effect()
  create$ = this.actions$
    .ofType(fromGroup.CREATE)
    .map((action: fromGroup.CreateAction) => action.groupName)
    .withLatestFrom(this.store.select(getSelectedExhibitionId))
    .switchMap(([groupName, exhibitionId]) =>
      this.groupService
        .createGroup(groupName, exhibitionId)
        .concatMap(() => [
          new fromGroup.CreateSuccessAction(),
          new fromGroup.FetchAllAction()
        ])
        .catch(() => Observable.of(new fromGroup.CreateFailureAction()))
    )

  @Effect({ dispatch: false })
  createSuccess$ = this.actions$.ofType(fromGroup.CREATE_SUCCESS).do(() => {
    this.toastCtrl.create({
      message: '创建标签成功',
      duration: 3e3,
      position: 'top'
    })
    .present()
  })

  @Effect({ dispatch: false })
  createFailure$ = this.actions$.ofType(fromGroup.CREATE_FAILURE).do(() => {
    this.toastCtrl
      .create({
        message: '创建标签失败',
        duration: 3e3,
        position: 'top'
      })
      .present()
  })

  @Effect()
  fetchALl$ = this.actions$
    .ofType(fromGroup.FETCH_ALL)
    .switchMap(() =>
      this.groupService
        .fetchAllGroup()
        .map(res => new fromGroup.FetchAllSuccessAction(res))
        .catch(() => Observable.of(new fromGroup.FetchAllFailureAction()))
    )

  @Effect({ dispatch: false })
  fetchAllSuccess$ = this.actions$.ofType(fromGroup.FETCH_ALL_SUCCESS).do(() => {
    // this.toastCtrl.create({
    //   message: '获取标签成功',
    //   duration: 3e3,
    //   position: 'top'
    // })
    // .present()
  })

  @Effect({ dispatch: false })
  fetchAllFailure$ = this.actions$.ofType(fromGroup.FETCH_ALL_FAILURE).do(() => {
    // this.toastCtrl
    //   .create({
    //     message: '获取标签失败',
    //     duration: 3e3,
    //     position: 'top'
    //   })
    //   .present()
  })


  @Effect({ dispatch: false })
  toRenameGroup$ = this.actions$.ofType(fromGroup.TO_RENAME_GROUP)
  .map((action: fromGroup.ToRenameGroupAction) => action.group)
  .do((group) => {
    this.modalCtrl.create(ToRenameGroupModal, group).present()
  })

  @Effect()
  ensureRenameGroup$ = this.actions$.ofType(fromGroup.ENSURE_RENAME_GROUP)
  .map((action: fromGroup.EnsureRenameGroupAction) => action.group)
  .switchMap(({ id, name }) => {
    return this.groupService.editGroup(id, name)
    .concatMap(() => [
      new fromGroup.RenameGroupSuccessAction(),
      new fromGroup.FetchAllAction()
    ])
    .catch(() => Observable.of(new fromGroup.RenameGroupFailureAction()))
  })

  @Effect({ dispatch: false })
  renameGroupSuccess$ = this.actions$.ofType(fromGroup.RENAME_GROUP_SUCCESS)
  .do(() => {
    this.toastCtrl.create({
      message: '重命名标签成功',
      duration: 3e3,
      position: 'top'
    }).present()
  })

  @Effect({ dispatch: false })
  renameGroupFailure$ = this.actions$.ofType(fromGroup.RENAME_GROUP_FAILURE)
  .do(() => {
    this.toastCtrl.create({
      message: '重命名标签失败',
      duration: 3e3,
      position: 'top'
    }).present()
  })


  @Effect({ dispatch: false })
  toDeleteGroup$ = this.actions$.ofType(fromGroup.TO_DELETE_GROUP)
  .map((action: fromGroup.ToDeleteGroupAction) => action.group)
  .do((group) => {
    this.modalCtrl.create(ToDeleteGroupModal, group).present()
  })

  @Effect()
  ensureDeleteGroup$ = this.actions$.ofType(fromGroup.ENSURE_DELETE_GROUP)
  .map((action: fromGroup.EnsureDeleteGroupAction) => action.groupId)
  .switchMap((groupId) => {
    return this.groupService.delGroup(groupId)
    .concatMap(() => [
      new fromGroup.DeleteGroupSuccessAction(),
      new fromCustomer.RemoveCustomerGroupIdAction(groupId),
      new fromGroup.FetchAllAction()
    ])
    .catch(() => Observable.of(new fromGroup.DeleteGroupFailureAction()))
  })

  @Effect({ dispatch: false })
  deleteGroupSuccess$ = this.actions$.ofType(fromGroup.DELETE_GROUP_SUCCESS)
  .do(() => {
    this.toastCtrl.create({
      message: '删除标签成功',
      duration: 3e3,
      position: 'top'
    }).present()
  })

  @Effect({ dispatch: false })
  deleteGroupFailure$ = this.actions$.ofType(fromGroup.DELETE_GROUP_FAILURE)
  .do(() => {
    this.toastCtrl.create({
      message: '删除标签失败',
      duration: 3e3,
      position: 'top'
    }).present()
  })


  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private groupService: GroupService,
    private store: Store<State>
  ) {}
}
