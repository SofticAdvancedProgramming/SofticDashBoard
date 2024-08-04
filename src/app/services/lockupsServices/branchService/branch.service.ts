import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { branch } from '../../../../models/branch';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../apiCall/apicall.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private branchUrl = `${environment.apiBaseUrl}Branch`;

  constructor(private apiCall: ApiCall) { }

  getBranch(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Get`, 'post', request, headers);
  }

  addBranch(branch: branch): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Add`, 'post', branch, headers);
  }

  editBranch(branch: branch): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Edit`, 'post', branch, headers);
  }

  deleteBranch(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.branchUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
