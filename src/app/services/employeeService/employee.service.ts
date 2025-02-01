import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { employeeController } from '../../apis/employeeController';
import { dashboardController } from '../../apis/dashboard';
import { EmployeeBenefitController } from '../../apis/EmployeeBenefit';

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
  editEmployee(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.EditEmployee, request);
  }

  addEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.employeeSalary + '/Add', request);
  }
  deleteEmployeeSalary(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.deleteemployeeSalary(id,companyId), {});
  }
  editEmployeeSalary(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.editemployeeSalary , request);
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
  deactiveEmployee(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.deactiveEmployee(id, companyId));
  }
  activeEmployee(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.activeEmployee(id, companyId));
  }

  loadEmployeeById(request: { id: number }): Observable<any> {
    return this.apiCall.request('POST', employeeController.loadEmployeeById, request);
  }
   //employee location
   loadEmployeeLocations(request: any): Observable<any> {
   
    return this.apiCall.request('POST', employeeController.loadEmployeeAttendanceLocation, request);
  }
  assignEmployeeLocation(request: any): Observable<any> {
  
    return this.apiCall.request('POST', employeeController.assignEmployeeLocation, request);
  }
  dleteEmployeeAttendanceLocation(companyId: number, id: number): Observable<any> {
    return this.apiCall.request('POST', employeeController.removeEmployeeAttendanceLocation(id, companyId));
  }
  EditEmployeeAttendanceLocation(request: any): Observable<any> {
    return this.apiCall.request('POST', employeeController.editEmployeeAttendanceLocation, request);
  }

  getEmployees(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', employeeController.GetEmployees, request);
  }

  getStatistics(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', dashboardController.GetStatistics, request);
  }
  getLeavesLog(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', employeeController.GetLeavesLog, request);
  }
  getFinancialLog(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', employeeController.GetFinancialLog, request);
  }

}
