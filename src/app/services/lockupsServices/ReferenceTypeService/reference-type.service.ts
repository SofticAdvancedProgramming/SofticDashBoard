import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ReferenceTypeService {
  private referenceTypeUrl = `${environment.apiBaseUrl}ReferenceType`;

  constructor(private apiCall: ApiCall) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // ReferenceType methods
  getReferenceTypes(request: any = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.referenceTypeUrl}/Get`, 'post', request, headers);
  }

  addReferenceType(referenceType: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.referenceTypeUrl}/Add`, 'post', referenceType, headers);
  }

  editReferenceType(referenceType: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.referenceTypeUrl}/Edit`, 'post', referenceType, headers);
  }

  deleteReferenceType(id: number, companyId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.referenceTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
