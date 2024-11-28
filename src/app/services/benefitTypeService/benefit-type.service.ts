import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { BenefitType } from '../../apis/benefitTypeController';

@Injectable({
  providedIn: 'root'
})
export class BenefitTypeService {

  constructor(private apiCall: ApiCall) { }

  getBenefitsType(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Get, request);
  }

  addBenefitType(benefit: any): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Add, benefit);
  }

  editBenefitType(benefit: any): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Edit, benefit);
  }

  deleteBenefitType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', BenefitType.Delete(id, companyId), {});
  }
}
