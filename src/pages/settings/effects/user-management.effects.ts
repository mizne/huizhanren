import { Injectable } from '@angular/core'
import { Effect, Actions } from '@ngrx/effects'
import { Observable } from 'rxjs/Observable'

import { ModalController } from 'ionic-angular'

import * as fromUserManagement from '../actions/user-management.action'
import { UserService } from '../services/user.service'
import { SmsService } from '../../../providers/sms.service'
import { ToastService } from '../../../providers/toast.service'
import { ToDeleteUserModal } from '../modals/to-delete-user-modal/to-delete-user-modal.component'
import { ToAddUserModal } from '../modals/to-add-user-modal/to-add-user-modal.component'

import { Store } from '@ngrx/store'
import { State, getUsers, getMaxUserCount } from '../reducers'

@Injectable()
export class UserManagementEffects {
  @Effect()
  fetchAllUser$ = this.actions$
    .ofType(fromUserManagement.FETCH_ALL_USER)
    .mergeMap(() =>
      this.userService
        .fetchAllUsers()
        .map(users => new fromUserManagement.FetchAllUserSuccessAction(users))
        .catch(() =>
          Observable.of(new fromUserManagement.FetchAllUserFailureAction([]))
        )
    )

  @Effect({ dispatch: false })
  fetchAllSuccess$ = this.actions$
    .ofType(fromUserManagement.FETCH_ALL_USER_SUCCESS)
    .do(() => {
      // this.toastCtrl.create({
      //   message: '获取所用用户成功',
      //   duration: 3e3,
      //   position: 'top'
      // })
      // .present()
    })

  @Effect({ dispatch: false })
  fetchAllFailure$ = this.actions$
    .ofType(fromUserManagement.FETCH_ALL_USER_FAILURE)
    .do(() => {
      // this.toastCtrl
      //   .create({
      //     message: '获取所用用户失败',
      //     duration: 3e3,
      //     position: 'top'
      //   })
      //   .present()
    })

  @Effect({ dispatch: false })
  toDelete$ = this.actions$
    .ofType(fromUserManagement.TO_DELETE_USER)
    .map((action: fromUserManagement.ToDeleteUserAction) => action.id)
    .do(id => {
      this.modalCtrl.create(ToDeleteUserModal, { userId: id }).present()
    })

  @Effect()
  ensureDeleteUser$ = this.actions$
    .ofType(fromUserManagement.ENSURE_DELETE_USER)
    .map((action: fromUserManagement.EnsureDeleteUserAction) => action.id)
    .mergeMap(id =>
      this.userService
        .deleteUser(id)
        .concatMap(() => [
          new fromUserManagement.DeleteUserSuccessAction(),
          new fromUserManagement.FetchAllUserAction()
        ])
        .catch(() =>
          Observable.of(new fromUserManagement.DeleteUserFailureAction())
        )
    )

  @Effect({ dispatch: false })
  deleteUserSuccess$ = this.actions$
    .ofType(fromUserManagement.DELETE_USER_SUCCESS)
    .do(() => {
      this.toastService
        .show('删除用户成功')
    })

  @Effect({ dispatch: false })
  deleteUserFailure$ = this.actions$
    .ofType(fromUserManagement.DELETE_USER_FAILURE)
    .do(() => {
      this.toastService
        .show('删除用户失败')
    })

  @Effect({ dispatch: false })
  toAddUser$ = this.actions$
    .ofType(fromUserManagement.TO_ADD_USER)
    .withLatestFrom(this.store.select(getMaxUserCount))
    .withLatestFrom(
      this.store.select(getUsers).map(e => e.length),
      ([_, maxCount], usersCount) => [maxCount, usersCount]
    )
    .do(([maxCount, usersCount]) => {
      if (usersCount >= maxCount) {
        this.toastService
          .show(`已有${usersCount}个用户, 不能创建更多了`)
      } else {
        this.modalCtrl.create(ToAddUserModal).present()
      }
    })

  @Effect()
  fetchSmsCode$ = this.actions$
    .ofType(fromUserManagement.FETCH_SMS_CODE)
    .map((action: fromUserManagement.FetchSMSCodeAction) => action.phone)
    .mergeMap(phone =>
      this.smsService
        .fetchVerifyCode(phone)
        .map(() => new fromUserManagement.FetchSMSCodeSuccessAction())
        .catch((err: Error) => {
          return Observable.of(
            new fromUserManagement.FetchSMSCodeFailureAction(err.message)
          )
        })
    )

  @Effect({ dispatch: false })
  fetchSmsCodeSuccess$ = this.actions$
    .ofType(fromUserManagement.FETCH_SMS_CODE_SUCCESS)
    .do(() => {
      this.toastService
        .show('验证码已发送, 请注意查收')
    })

  @Effect({ dispatch: false })
  fetchSmsCodeFailure$ = this.actions$
    .ofType(fromUserManagement.FETCH_SMS_CODE_FAILURE)
    .map(
      (action: fromUserManagement.FetchSMSCodeFailureAction) => action.errorMsg
    )
    .do(errorMsg => {
      this.toastService
        .show(`验证码发送失败`)
    })

  @Effect()
  ensureAddUser$ = this.actions$
    .ofType(fromUserManagement.ENSURE_ADD_USER)
    .map((action: fromUserManagement.EnsureAddUserAction) => action.payload)
    .mergeMap(({ name, phone, code }) =>
      this.smsService
        .verifyCode(phone, code)
        .mergeMap(() => this.userService.createUser({ name, phone }))
        .mergeMap(() => {
          return [
            new fromUserManagement.AddUserSuccessAction(),
            new fromUserManagement.FetchAllUserAction()
          ]
        })
        .catch(() =>
          Observable.of(new fromUserManagement.AddUserFailureAction())
        )
    )

  @Effect({ dispatch: false })
  addUserSuccess$ = this.actions$
    .ofType(fromUserManagement.ADD_USER_SUCCESS)
    .do(() => {
      this.toastService
        .show('添加用户成功')
    })

  @Effect({ dispatch: false })
  addUserFailure$ = this.actions$
    .ofType(fromUserManagement.ADD_USER_FAILURE)
    .do(() => {
      this.toastService
        .show('添加用户失败')
        
    })

  constructor(
    private actions$: Actions,
    private modalCtrl: ModalController,
    private toastService: ToastService,
    private userService: UserService,
    private smsService: SmsService,
    private store: Store<State>
  ) {}
}
