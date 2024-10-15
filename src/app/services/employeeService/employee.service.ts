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
    return this.apiCall.request('POST', employeeController.assignToBranch, request);
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
}
    