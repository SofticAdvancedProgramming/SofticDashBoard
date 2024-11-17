import { Injectable } from '@angular/core';
 import { Observable } from 'rxjs';
 import { ApiCall } from '../../core/services/http-service/HttpService';
import { EmployeeAttendances } from '../../apis/EmployeeAttendancesController';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  constructor(private apiCall: ApiCall) { }


  // Methods
  getAttendances(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', EmployeeAttendances.Get, request);
  }

  getChart(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', EmployeeAttendances.GetChart, request);
  }
}
