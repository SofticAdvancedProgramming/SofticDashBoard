import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class LifeStyleTypeService {
  private lifeStyleTypeUrl = `${environment.apiBaseUrl}LifeStyleType`;

  constructor(private apiCall: ApiCall) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // LifeStyleType methods
  getLifeStyleTypes(request: any = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.lifeStyleTypeUrl}/Get`, 'post', request, headers);
  }

  addLifeStyleType(lifeStyleType: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.lifeStyleTypeUrl}/Add`, 'post', lifeStyleType, headers);
  }

  editLifeStyleType(lifeStyleType: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.lifeStyleTypeUrl}/Edit`, 'post', lifeStyleType, headers);
  }

  deleteLifeStyleType(id: number, companyId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.lifeStyleTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
