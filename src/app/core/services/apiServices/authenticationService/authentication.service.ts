import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpService } from '../../http-service/HttpService';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  public isLoggedIn$: Observable<boolean> = this.loggedIn.asObservable();

  constructor(
    private http: HttpService,
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
    return this.http.SendRequest('POST', `Auth/Login`, {
      email,
      password,
    }).pipe(
      map((response) => {
        if (response?.data?.isAuth) {
          this.loggedIn.next(true);
          localStorage.setItem('token', response.data.token);
          this.setPermissionsFromToken(response.data.token);
          return response;
        }
        return response;
      }),
    );
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('companyId');
      localStorage.removeItem('roles');
      localStorage.removeItem('logo');
       localStorage.removeItem('primaryColor');
       localStorage.removeItem('secondaryColor');
       localStorage.removeItem('fontName');
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

    localStorage.setItem('roles', JSON.stringify(roles));
    this.permissionsService.loadPermissions(roles);
  }

  setPermissionsFromUserType(userType: string): void {
    const roles = [userType];
    this.permissionsService.loadPermissions(roles);
  }

  forgetPassword(email: string): Observable<any> {
    return this.http
      .SendRequest('POST', `Auth/ForgetPassword`, { email })
      .pipe(
        map((response) => response)
      );
  }

  resetPassword(email: string, password: string, otp: string): Observable<any> {
    return this.http.SendRequest('POST', `Auth/ResetPassword`, { email, password, otp })
      .pipe(
        map((response) => response)
      );
  }
}
