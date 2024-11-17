import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { authController } from '../../apis/authController';
import { AgainestTypeController } from '../../apis/againistTypeController';
 
@Injectable({
  providedIn: 'root'
})
export class CompliantsAndSuggestionsService {

  constructor(private apiCall: ApiCall) { }

  getCurrentUser() {
    return this.apiCall.request("POST", authController.GetCurrentUser);
  }

  getAllAgainesType() {
    let body={
      "sortCol":"test"
    }
    return this.apiCall.request("POST", AgainestTypeController.Get,body);
  }
  addAgainesType(newEntity: any) {  
    return this.apiCall.request("POST", AgainestTypeController.Add, newEntity);
  }

  deletegainesType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', AgainestTypeController.Delete(id, companyId), {});
  }
}
