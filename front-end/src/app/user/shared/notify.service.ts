import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class NotifyService {
  constructor(private notify: NotifierService) {}
  public loading: boolean = false;

  showNotify(type: string, message: string) {
    this.notify.notify(type, message);
  }

  showAlert(title: string, message: string) {
    Swal.fire(title, message, 'success');
  }

  onAlertComfirm() {
    return Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });
  }
}
