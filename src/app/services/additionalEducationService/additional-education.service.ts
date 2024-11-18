import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userAdditionalEducationController } from '../../apis/additionalEducationController';

@Injectable({
  providedIn: 'root'
})
export class AdditionalEducationService {

  constructor(private apiCall:ApiCall) { }

  getAditionalEducation(request: any): Observable<any> {
    return this.apiCall.request('POST', userAdditionalEducationController.loadAddresses, request);
  }
}
