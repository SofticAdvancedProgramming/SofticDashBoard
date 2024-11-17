import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { userEducationController } from '../../apis/userEducationController';

@Injectable({
  providedIn: 'root'
})
export class UserEducationService {

  constructor(private apiCall:ApiCall) { }

  getEducation(request: any): Observable<any> {
    return this.apiCall.request('POST', userEducationController.loadAddresses, request);
  }
}
