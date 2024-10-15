import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userController } from '../../apis/userController';
 
@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor(private apiCall: ApiCall) { }

  loadPersonalInformation(request: any): Observable<any> {
    return this.apiCall.request('POST', userController.loadPersonalInformation, request);
  }

  editPersonalInformation(request: any): Observable<any> {
    return this.apiCall.request('POST', userController.editPersonalInformation, request);
  }
}
