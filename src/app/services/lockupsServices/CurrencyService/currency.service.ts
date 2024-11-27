import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private CurrencyTypeUrl = `${environment.apiBaseUrl}Currency`;

  constructor(private apiCall:ApiCall) { }

  getCurrencyTypes(): Observable<any> {
    return this.apiCall.request('POST', `${this.CurrencyTypeUrl}/Get`, {});
  }

  addCurrencyType(CurrencyType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.CurrencyTypeUrl}/Add`, CurrencyType);
  }

  editCurrencyType(CurrencyType: any): Observable<any> {
    return this.apiCall.request('POST', `${this.CurrencyTypeUrl}/Edit`, CurrencyType);
  }

  deleteCurrencyType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.CurrencyTypeUrl}/Delete/${id}/${companyId}`, {});
  }

  defaultCurrencyType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', `${this.CurrencyTypeUrl}/Default/${id}/${companyId}`, {});
  }
}
