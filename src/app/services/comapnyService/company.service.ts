import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { Company } from '../../../models/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiBaseUrl}Company`;

  constructor(private apiCall: ApiCall) {}

  loadCompanies(request:any): Observable<Company[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/Get', 'post', request, headers);
  }
  getCompany(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/Get', 'post',request, headers);
  }
  AddCompany(request:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(this.apiUrl+'/Add', 'post',request, headers);
  }
}
