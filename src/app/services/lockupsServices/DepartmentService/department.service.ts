import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../apiCall/apicall.service';
import { Department } from '../../../../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private departmentUrl = `${environment.apiBaseUrl}Department`;

  constructor(private apiCall: ApiCall) {}

  getDepartment(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.departmentUrl}/Get`, 'post', request, headers);
  }

  addDepartment(department: Department): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.departmentUrl}/Add`, 'post', department, headers);
  }

  editDepartment(department: Department): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.departmentUrl}/Edit`, 'post', department, headers);
  }

  deleteDepartment(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.departmentUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
