import { Injectable, OnDestroy } from '@angular/core'
import { ToastController, Toast, ToastOptions } from 'ionic-angular'
import { Subject } from 'rxjs/Subject'
import { debounceTime } from 'rxjs/operators'
import { Subscription } from 'rxjs/Subscription'

@Injectable()
export class ToastService implements OnDestroy {
  private ensureToast: Subject<string | ToastOptions> = new Subject<
    string | ToastOptions
  >()
  private subscription: Subscription
  constructor(private toastCtrl: ToastController) {
    this.subscription = this.ensureToast
      .asObservable()
      .pipe(debounceTime(2e2))
      .subscribe(option => {
        const normalizeOpt =
          typeof option === 'string'
            ? {
                message: option,
                duration: 3e3,
                position: 'top'
              }
            : option
        const toast = this.toastCtrl.create(normalizeOpt)
        toast.present()
      })
  }

  show(option: string | ToastOptions) {
    this.ensureToast.next(option)
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
