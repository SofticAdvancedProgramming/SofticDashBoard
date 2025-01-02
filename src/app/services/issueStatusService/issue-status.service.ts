import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { IssueStatusController } from '../../apis/issueStatusController';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueStatusService {

   constructor(private apiCall: ApiCall) { }
  
    getIssueStatus(params: { companyId?: number;}): Observable<any> {
      return this.apiCall.request("POST", IssueStatusController.Get, params);
    }
}
