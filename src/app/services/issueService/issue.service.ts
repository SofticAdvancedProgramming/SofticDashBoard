import { Injectable } from '@angular/core';
 
import { Observable } from 'rxjs';
import { issueController } from '../../apis/issueController';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class IssueService {

  constructor(private apiCall: ApiCall) { }
  getIssues(params: { companyId: number; issueTypeId: number }): Observable<any> {
    return this.apiCall.request("POST", issueController.Get, params);
  }


  addIssue(newEntity: any) {  
    return this.apiCall.request("POST", issueController.Add, newEntity);
  }

  deleteIssue(id: number, companyId: number): Observable<any> {
    return this.apiCall.request("POST", issueController.Delete(id, companyId), {});
  }
  getIssueById(id: number): Observable<any> {
    const requestBody = { id };  
    return this.apiCall.request("POST", issueController.Get, requestBody);
  }
}