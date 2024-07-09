import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../apiCall/apicall.service';


@Injectable({
  providedIn: 'root',
})
export class BusinessService {
  private businessSizeUrl = `${environment.apiBaseUrl}BusinessSize`;
  private businessTypeUrl = `${environment.apiBaseUrl}BusinessType`;

  constructor(private apiCall: ApiCall) {}

  // Business Size methods
  getBusinessSizes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessSizeUrl}/Get`, 'post', request, headers);
  }

  addBusinessSize(businessSize: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessSizeUrl}/Add`, 'post', businessSize, headers);
  }

  editBusinessSize(businessSize: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessSizeUrl}/Edit`, 'post', businessSize, headers);
  }

  deleteBusinessSize(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessSizeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }

  // Business Type methods
  getBusinessTypes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessTypeUrl}/Get`, 'post', request, headers);
  }

  addBusinessType(businessType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessTypeUrl}/Add`, 'post', businessType, headers);
  }

  editBusinessType(businessType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessTypeUrl}/Edit`, 'post', businessType, headers);
  }

  deleteBusinessType(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.businessTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
