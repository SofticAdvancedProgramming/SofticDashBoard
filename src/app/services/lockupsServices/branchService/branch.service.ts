import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../../../../models/department';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../apiCall/apicall.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private branchUrl = `${environment.apiBaseUrl}Branch`;

  constructor(private apiCall: ApiCall) { }

  getDepartment(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Get`, 'post', request, headers);
  }

  addDepartment(department: Department): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Add`, 'post', department, headers);
  }

  editDepartment(department: Department): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Edit`, 'post', department, headers);
  }

  deleteDepartment(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
