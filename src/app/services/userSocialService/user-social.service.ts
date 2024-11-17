import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userSocialController } from '../../apis/userSocialController';


@Injectable({
  providedIn: 'root'
})
export class UserSocialService {

  constructor(private apiCall:ApiCall) { }

  getSocial(request: any): Observable<any> {
    return this.apiCall.request('POST', userSocialController.loadAddresses, request);
  }
}
