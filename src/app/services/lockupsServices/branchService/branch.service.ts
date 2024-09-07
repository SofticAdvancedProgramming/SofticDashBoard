import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { branch } from '../../../../models/branch';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  private branchUrl = `${environment.apiBaseUrl}Branch`;

  constructor(private apiCall: ApiCall) { }

  getBranch(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request('POST', `${this.branchUrl}/Get`, request);
  }

  addBranch(branch: branch): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request('POST', `${this.branchUrl}/Add`, branch);
  }

  editBranch(branch: branch): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request('POST', `${this.branchUrl}/Edit`, branch);
  }

  deleteBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.branchUrl}/Delete/${id}/${companyId}`, {});
  }
  ActivateBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.branchUrl}/Activate/${id}/${companyId}`, {});
  }
  DeActivateBranch(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.branchUrl}/DeActivate/${id}/${companyId}`, {});
  }
}
