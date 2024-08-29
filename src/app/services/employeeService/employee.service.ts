import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../../core/services/http-service/HttpService';
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiBaseUrl}Employee`;

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
  deleteEmployee(companyId:number,id:number): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + `/Delete/${id}/${companyId}`);
  }

}
