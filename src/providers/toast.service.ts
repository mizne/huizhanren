import { Injectable } from '@angular/core'
import { ToastController, Toast, ToastOptions } from 'ionic-angular'

@Injectable()
export class ToastService {
  constructor(private toastCtrl: ToastController) {}

  show(option: string | ToastOptions): Toast {
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
    return toast
  }
}
