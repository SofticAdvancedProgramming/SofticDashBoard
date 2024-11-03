import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private apiCall: ApiCall) { }

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  setUser(user: any) {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user')!);
  }
  getNotification(q: any): Observable<any> {
    return this.apiCall.request(
      'POST',
      `NotificationLog/Get`,
      q
    )
  }

  countNotification(q: any): Observable<any> {
    return this.apiCall.request(
      'POST',
      `NotificationLog/UnviewedCount`,
      q
    )
  }

  deleteNotification(employeeId: number, companyId: number): Observable<any> {
    return this.apiCall.request(
      'POST',
      `NotificationLog/Delete/${employeeId}/${companyId}`,
      {}
    )
  }

  deleteAllNotification(employeeId: number, companyId: number): Observable<any> {
    return this.apiCall.request(
      'POST',
      `NotificationLog/Bulk-Delete/${employeeId}/${companyId}`,
      {}
    )
  }
}
