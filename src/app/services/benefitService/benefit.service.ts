import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmployeeBenefitController } from '../../apis/EmployeeBenefit';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  constructor(private apiCall: ApiCall) { }
  addEmployeeBenefit(request: any): Observable<any> {
    return this.apiCall.request('POST', EmployeeBenefitController.add, request);
  }
  GetEmployeeBenefit(request: any): Observable<any> {
    return this.apiCall.request('POST', EmployeeBenefitController.get, request);
  }
  editBenefit (benefit: any): Observable<any> {
    return this.apiCall.request('POST', EmployeeBenefitController.Edit, benefit);
  }

  deleteBenefit (id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', EmployeeBenefitController.Delete(id, companyId), {});
  }
}
