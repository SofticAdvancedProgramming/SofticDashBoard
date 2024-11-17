import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { employeeController } from '../../apis/employeeController';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private apiCall: ApiCall) { }

  loadEmployees(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.loadEmployees, request);
  }

  addEmployee(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.addEmployee, request);
  }

  assginEmployeeToPosition(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.assignToPosition, request);
  }

  assginEmployeeToDepartment(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.assignToDepartment, request);
  }

  assginEmployeeToBranch(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.assignToBranch + '/AssginBranch', request);
  }


  // Employee Salary
  loadEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.employeeSalary + '/Get', request);
  }

  addEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.employeeSalary + '/Add', request);
  }

  assginEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.assginSalary, request);
  }

  assginShift(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.assignShift, request);
  }

  deleteEmployee(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.deleteEmployee(id, companyId));
  }

  loadEmployeeById(request: { id: number }): Observable<any> {
    return this.apiCall.request('POST', employeeController.loadEmployeeById, request);
  }
   //employee location
   loadEmployeeLocations(request: any): Observable<any> {
    console.log(request);
    return this.apiCall.request('POST', employeeController.loadEmployeeAttendanceLocation, request);
  }
  assignEmployeeLocation(request: any): Observable<any> {
    console.log(request);
    return this.apiCall.request('POST', employeeController.assignEmployeeLocation, request);
  }
  dleteEmployeeAttendanceLocation(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.removeEmployeeAttendanceLocation(id, companyId));
  }
  EditEmployeeAttendanceLocation(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.editEmployeeAttendanceLocation, request);
  }

}
