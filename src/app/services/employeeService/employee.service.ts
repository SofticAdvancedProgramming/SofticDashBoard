 import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { employee } from '../../../models/employee';
 @Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiBaseUrl}Employee`;

  constructor(private apiCall: ApiCall) {}

  loadEmployees(request: any): Observable<{ status: number, message: string, data: { list: employee[] } }> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<{ status: number, message: string, data: { list: employee[] } }>(this.apiUrl + '/Get', 'post', request, headers);
  }
  addEmployee(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/Add', 'post',request, headers);
  }
  assginEmployeeToPosition(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/AssginPosition', 'post',request, headers);
  }
  
}
