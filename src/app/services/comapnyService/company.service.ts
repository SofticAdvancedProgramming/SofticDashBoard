import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `${environment.apiBaseUrl}Company`;

  constructor(private apiCall: ApiCall) { }

  loadCompanies(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Get', request,);
  }
  getCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Get', request,);
  }
  AddCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Add', request,);
  }
  EditCompany(request: any): Observable<any> {
     return this.apiCall.request('POST', this.apiUrl + '/Edit');
  }
  
  ActivateCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Add', request,);
  }
  DeActivateCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', this.apiUrl + '/Add', request,);
  }
  ActivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/Activate/${id}/${companyId}`, {});
  }
  DeActivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/DeActivate/${id}/${companyId}`, {});
  }
}
