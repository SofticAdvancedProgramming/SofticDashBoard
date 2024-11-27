import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { BenefitType } from '../../apis/benefitTypeController';

@Injectable({
  providedIn: 'root'
})
export class BenefitTypeService {

  constructor(private apiCall: ApiCall) { }

  getBenefits(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Get, request);
  }

  addBenefit(benefit: any): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Add, benefit);
  }

  editBenefit(benefit: any): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Edit, benefit);
  }

  deleteBenefit(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Delete(id, companyId), {});
  }
}
