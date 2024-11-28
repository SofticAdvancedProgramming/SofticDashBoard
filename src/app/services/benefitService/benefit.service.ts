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
    return this.apiCall.request('POST', EmployeeBenefitController.addEmployeeBenefit, request);
  }
  GetEmployeeBenefit(request: any): Observable<any> {
    return this.apiCall.request('POST', EmployeeBenefitController.getEmployeeBenefit, request);
  }
}
