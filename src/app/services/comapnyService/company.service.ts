import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { company } from '../../../models/company';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiBaseUrl}Company/Get`;

  constructor(private apiCall: ApiCall) {}

  loadCompanies(): Observable<company[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl, 'post', {}, headers);
  }
  getCompany(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl, 'post',request, headers);
  }
}
