import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { requestController } from '../../apis/requestController';
import { ReciverRequestSC, RequestAction, RequestAttachment } from '../../common-component/interfaces/requests';
import { reciverRequestController } from '../../apis/reciverRequestController';
import { requestCategoryController } from '../../apis/requestCategoryController';
import { ApiCall } from '../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: ApiCall) { }

  // General Requests
  getRequests(request: Partial<Request> = {}): Observable<any> {
    return this.http.request('POST', requestController.Get, request);
  }

  addRequests(request: Request & { requestAttachments: RequestAttachment[] }): Observable<any> {
    return this.http.request('POST', requestController.Add, request);
  }

  editRequests(request: Request & { requestAttachments: RequestAttachment[] }): Observable<any> {
    return this.http.request('POST', requestController.Edit, request);
  }

  deleteRequest(id: number, companyId: number): Observable<any> {
    return this.http.request('POST', requestController.Delete(id, companyId), {});
  }

  actionRequests(requestAction: RequestAction): Observable<any> {
    return this.http.request('POST', requestController.Action, requestAction);
  }

  // Receiver-Specific Requests
  getReciverRequest(request: Partial<ReciverRequestSC> = {}): Observable<any> {
    return this.http.request('POST', reciverRequestController.Get, request);
  }

  actionReciverRequests(requestAction: RequestAction): Observable<any> {
    return this.http.request('POST', reciverRequestController.Action, requestAction);
  }

  // Request Categories
  getRequestCategory(request: any = {}): Observable<any> {
    return this.http.request('POST', requestCategoryController.Get, request);
  }
}
