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
  private assginSalary = `${environment.apiBaseUrl}Employee/AssginSalary`;

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
  deleteEmployee(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + `/Delete/${id}/${companyId}`);
  }


  // Employee Salary

  loadEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', this.employeeSalary + '/Get', request);
  }

  addEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', this.employeeSalary + '/Add', request);
  }

  assginEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', this.assginSalary, request);
  }

}
