import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ToastersService } from '../toast-service/toast.service';
import { Router } from '@angular/router';
import { TranslationService } from '../translationService/translation.service';


@Injectable({
  providedIn: 'root'
})
export class ApiCall {

  constructor(
    private http: HttpClient,
    private toast: ToastersService,
    private router: Router,
    private translate: TranslationService
  ) { }

  private jwt(): HttpHeaders {
    let token = localStorage.getItem('token');
    let httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }
    return httpHeaders;
  }

  request(method: string, url: string, data?: any, params?: HttpParams, _responseType?: string): Observable<any> {
    const attachmentCategoryUrl = `${url}`;
    return this.http.request(method, attachmentCategoryUrl, {
      headers: this.jwt(),
      body: data,
      params: params
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }



  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = this.extractErrorMessage(error);
    switch (error.status) {
      case 401:
        this.handleUnauthorized();
        break;
      case 403:
        this.toast.typeError(errorMessage);
        break;
      case 400:
        this.handleBadRequest(error);
        break;
      case 404:
        this.handleBadRequest(error);
        break;
      default:
        this.toast.typeError(errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    } else if (error.message) {
      return error.message;
    } else {
      return 'An error occurred';
    }
  }

  private handleUnauthorized(): void {
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }

  private handleBadRequest(error: HttpErrorResponse): void {
    if (error.error?.errors && error.error.errors.length > 0) {
      this.toast.typeError(this.translate.translate(`errorModels.${error.error.errors[0]}`));
    } else if (error.error?.message) {
      this.toast.typeError(error.error.message);
    } else {
      this.toast.typeError('Bad Request');
    }
  }


  // this method for handel refresh Token

  // refreshToken() {
  //   let token: AccessToken = JSON.parse(localStorage.getItem('tokens')!);
  //   this.SendRequest('POST', environment.apiUrl + 'auth/refresh-token', { refresh_token: token.refresh.token }).subscribe((response) => {
  //     this.storage.RefreshToken(response);
  //     this.commonService.reloadComponent();
  //   })
  // }
}
