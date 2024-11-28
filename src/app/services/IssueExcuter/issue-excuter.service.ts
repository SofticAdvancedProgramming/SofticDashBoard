import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { IssueExcuter } from '../../apis/IssueExcuter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IssueExcuterService {

  constructor(private apiCall: ApiCall) { }

  getIssueExcuter(params: { companyId?: number; issueTypeId?: number ,id?:number,excuterId?:number}): Observable<any> {
    return this.apiCall.request("POST", IssueExcuter.Get, params);
  }

  addIssueExcuter(newEntity: any) {
    return this.apiCall.request("POST", IssueExcuter.Add, newEntity);
  }

  editIssueExcuter(entity: any) {
    return this.apiCall.request("POST", IssueExcuter.Edit, entity);
  }

  deleteIssueExcuter(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', IssueExcuter.Delete(id, companyId), {});
  }

  activateIssueExcuter(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', IssueExcuter.Activate(id, companyId), {});
  }

  deActivateIssueExcuter(id: number, companyId: number): Observable<any> {
    return this.apiCall.request('POST', IssueExcuter.DeActivate(id, companyId), {});
  }

  performActionOnIssueExcuter(id: number, issueStatusId: number): Observable<any> {
    return this.apiCall.request('POST', IssueExcuter.Action(id, issueStatusId), {});
  }

  getIssueExcuterCount(): Observable<any> {
    return this.apiCall.request("POST", IssueExcuter.Count, {});
  }

  getIssueExcuterById(id: number): Observable<any> {
    return this.apiCall.request("POST", IssueExcuter.Get, { id });
}
  getAllStatus(){
    return this.apiCall.request("POST", IssueExcuter.Status, {});
  }
  }
