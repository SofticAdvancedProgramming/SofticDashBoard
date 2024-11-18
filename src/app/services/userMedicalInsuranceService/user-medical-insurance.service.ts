import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userMedicalInsuranceController } from '../../apis/userMedicalInsuranceController';

@Injectable({
  providedIn: 'root'
})
export class UserMedicalInsuranceService {

  constructor(private apiCall:ApiCall) { }

  getMedicalInsurance(request: any): Observable<any> {
    return this.apiCall.request('POST', userMedicalInsuranceController.loadAddresses, request);
  }
}
