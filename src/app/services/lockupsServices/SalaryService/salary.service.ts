import { Injectable } from '@angular/core';
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalaryTypeService {

  private SalaryTypeUrl = `${environment.apiBaseUrl}SalaryType`;

  constructor(private apiCall: ApiCall) { }

  getSalaryTypes(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.SalaryTypeUrl}/Get`, request);
  }

  addSalaryType(SalaryType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.SalaryTypeUrl}/Add`, SalaryType);
  }

  editSalaryType(SalaryType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.SalaryTypeUrl}/Edit`, SalaryType);
  }

  deleteSalaryType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.SalaryTypeUrl}/Delete/${id}/${companyId}`, {});
  }
}
