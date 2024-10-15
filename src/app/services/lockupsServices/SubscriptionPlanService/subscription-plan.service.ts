import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../../core/services/http-service/HttpService';
import { subscriptionPlanController } from '../../../apis/subscriptionPlanController';
 
@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {

  constructor(private apiCall: ApiCall) { }

  getSubscriptionPlan(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', subscriptionPlanController.getSubscriptionPlan, request);
  }

  addSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request('POST', subscriptionPlanController.addSubscriptionPlan, subscriptionPlan);
  }

  editSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request('POST', subscriptionPlanController.editSubscriptionPlan, subscriptionPlan);
  }

  deleteSubscriptionPlan(id: number): Observable<any> {
    return this.apiCall.request('POST', subscriptionPlanController.deleteSubscriptionPlan(id), {});
  }
}
