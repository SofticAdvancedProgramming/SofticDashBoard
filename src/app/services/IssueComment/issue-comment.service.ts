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
      comment
    }
    return this.apiCall.request("POST", issueCommentController.Add,body);
  }

  getIssueComments(companyId:number,issueId:number){
    let body={
      companyId,
      issueId
    }
    return this.apiCall.request("POST", issueCommentController.Get,body);
  }
}
