import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { issueCommentController } from '../../apis/issueCommentController';

@Injectable({
  providedIn: 'root'
})
export class IssueCommentService {

  constructor(private apiCall: ApiCall) { }


  addIssueComment(comment: string,companyId:number,issueExcuterId:number,issueId:number) {
    let body={
      companyId,
      issueExcuterId,
      issueId,
      comment,
      isAdmin: true
    }  
    return this.apiCall.request("POST", issueCommentController.Add,body);
  }
}
