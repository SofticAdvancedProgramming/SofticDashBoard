import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../../core/services/http-service/HttpService';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiBaseUrl}Employee`;
  private employeeSalary = `${environment.apiBaseUrl}EmployeeSalary`;

  constructor(private apiCall: ApiCall) { }

  loadEmployees(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Get', request);
  }
  addEmployee(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Add', request);
  }
  assginEmployeeToPosition(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/AssginPosition', request);
  }

  assginEmployeeToDepartment(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/AssginDepartment', request);
  }

  assginEmployeeToBranch(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/AssginBranch', request);
  }
  assginShift(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/AssginShift', request);
  }    
  deleteEmployee(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + `/Delete/${id}/${companyId}`);
  }
 loadEmployeeById(request: { id: number }): Observable<any> {
  return this.apiCall.request('POST', `${this.apiUrl}/Get`, request);
}

  // Employee Salary

  loadEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', this.employeeSalary + '/Get', request);
  }

  addEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', this.employeeSalary + '/Add', request);
  }


 

}
