import { Injectable } from '@angular/core';
import { ApiCall } from '../../core/services/http-service/HttpService';
import { Observable } from 'rxjs';
import { userAttachmentsController } from '../../apis/userAttachmentsController';

@Injectable({
  providedIn: 'root'
})
export class UserAttachmentsService {

  constructor(private apiCall:ApiCall) { }

  getAttachments(request: any): Observable<any> {
    return this.apiCall.request('POST', userAttachmentsController.loadAddresses, request);
  }
}
