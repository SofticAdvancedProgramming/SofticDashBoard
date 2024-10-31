import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { companyController } from '../../apis/companyController';
 
@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  constructor(private apiCall: ApiCall) { }

  loadCompanies(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.loadCompanies, request);
  }

  getCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.getCompany, request);
  }

  addCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.addCompany, request);
  }

  editCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.editCompany, request);
  }

  activateCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.activateCompany, request);
  }

  deactivateCompany(request: any): Observable<any> {
    return this.apiCall.request('POST', companyController.deactivateCompany, request);
  }

  activatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', companyController.activatePosition(id, companyId), {});
  }

  deactivatePosition(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', companyController.deactivatePosition(id, companyId), {});
  }
}
