import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { company } from '../../../../../models/company';
import { HttpService } from '../../http-service/HttpService';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  private apiUrl = `Company/Get`;

  constructor(private http: HttpService) { }

  loadCompanies(): Observable<company[]> {
    return this.http.SendRequest('POST', this.apiUrl, {});
  }

  getCompany(request: any): Observable<any> {
    return this.http.SendRequest('POST', this.apiUrl, request);
  }
}
