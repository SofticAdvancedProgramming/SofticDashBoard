import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(
    private apiCall: ApiCall,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  public isAuthenticated(): boolean {
    let token: string | null = null;
    const helper = new JwtHelperService();
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token');
    }
    if (!token) {
      return false;
    }
    try {
      const isExpired = helper.isTokenExpired(token);
      return !isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return false;
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/Login`, 'post', {
        email,
        password,
      })
      .pipe(
        map((response) => {
          if (response && response.token) {
            if (isPlatformBrowser(this.platformId)) {
              localStorage.setItem('token', response.token);
            }
            this.loggedIn.next(true);
            return response;
          }
          return response;
        }),
        catchError((error) => throwError(() => error))
      );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  }

  forgetPassword(email: string): Observable<any> {
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/ForgetPassword`, 'post', {
        email,
      })
      .pipe(
        map((response) => response),
        catchError((error) => throwError(() => error))
      );
  }

  resetPassword(email: string, password: string, otp: string): Observable<any> {
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/ResetPassword`, 'post', {
        email,
        password,
        otp,
      })
      .pipe(
        map((response) => response),
        catchError((error) => throwError(() => error))
      );
  }
}
