import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, finalize, Observable, throwError } from 'rxjs';
import { SpinnerService } from '../../spinner/spinner.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinner: SpinnerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Set a timeout to show the spinner after 5 seconds
    let showSpinnerTimeout = setTimeout(() => {
      this.spinner.show();
    }, 500);

    return next.handle(request).pipe(
      finalize(() => {
        // Clear the timeout if the request completes before 5 seconds
        clearTimeout(showSpinnerTimeout);
        // Hide the spinner if it was shown
        this.spinner.hide();
      }),
      catchError((error) => {
        // Clear the timeout in case of an error
        clearTimeout(showSpinnerTimeout);
        // Hide the spinner in case of an error
        this.spinner.hide();
        return throwError(error);
      })
    );
  }
}
