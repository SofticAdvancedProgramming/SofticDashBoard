import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(
    private apiCall: ApiCall,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private permissionsService: NgxPermissionsService,
  ) {
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;
    if (token) {
      this.loggedIn.next(true);
      this.setPermissionsFromToken(token);
    }
  }

  public isAuthenticated(): boolean {
    const helper = new JwtHelperService();
    let token: string | null = null;
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
    console.log('Attempting login with email:', email);
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/Login`, 'post', {
        email,
        password,
      })
      .pipe(
        map((response) => {
          if (response?.data?.isAuth) {
            this.loggedIn.next(true);
            localStorage.setItem('token', response.data.token);
            this.setPermissionsFromToken(response.data.token);
            return response;
          }
          return response;
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || 'An unknown error occurred';
    return throwError(() => new Error(errorMessage));
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('companyId');
      localStorage.removeItem('roles');
    }
    this.permissionsService.flushPermissions();
    window.location.href = '/';
  }

  public decodeToken(token: string): any { // Changed to public
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Invalid token:', e);
      return null;
    }
  }

  private setPermissionsFromToken(token: string): void {
    const decodedToken = this.decodeToken(token);
    let roles = [];
    if (typeof decodedToken?.roles === 'string') {
      roles = decodedToken.roles.split(',');
    } else if (Array.isArray(decodedToken?.roles)) {
      roles = decodedToken.roles;
    }
    console.log('Decoded Roles:', roles);
    localStorage.setItem('roles', JSON.stringify(roles));
    this.permissionsService.loadPermissions(roles);
  }

  setPermissionsFromUserType(userType: string): void {
    const roles = [userType];
    this.permissionsService.loadPermissions(roles);
  }

  forgetPassword(email: string): Observable<any> {
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/ForgetPassword`, 'post', { email })
      .pipe(
        map((response) => response),
        catchError((error) => throwError(() => error))
      );
  }

  resetPassword(email: string, password: string, otp: string): Observable<any> {
    return this.apiCall
      .request<any>(`${environment.apiBaseUrl}Auth/ResetPassword`, 'post', { email, password, otp })
      .pipe(
        map((response) => response),
        catchError((error) => throwError(() => error))
      );
  }
}
