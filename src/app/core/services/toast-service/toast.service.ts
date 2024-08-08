import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastersService {
  constructor(private toastr: ToastrService) {}
  // Show a success toast
  typeSuccess(message: string, title: string = 'Success') {
    this.toastr.success(message, title, {
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing',
      positionClass:'toast-top-right'
    });
  }
  // Show an info toast
  typeInfo(message: string, title: string = 'Info') {
    this.toastr.info(message, title, {
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing',
      positionClass:'toast-top-right'
    })
  }
  // Show a warning toast
  typeWarning(message: string, title: string = 'Warning') {
    this.toastr.warning(message, title, {
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing',
      positionClass:'toast-top-right'
    })
  }

  // Show an error toast
  typeError(message: string, title: string = 'Error') {
    this.toastr.error(message, title, {
      timeOut:3000,
      progressBar:true,
      progressAnimation:'increasing',
      positionClass:'toast-top-right'
    })
  }
}
