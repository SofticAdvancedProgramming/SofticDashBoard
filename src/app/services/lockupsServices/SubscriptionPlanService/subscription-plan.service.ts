import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ApiCall } from '../../../core/services/http-service/HttpService';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  private SubscriptionPlanUrl = `${environment.apiBaseUrl}SubscriptionPlan`;

  constructor(private apiCall: ApiCall) { }

  getSubscriptionPlan(request: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${this.SubscriptionPlanUrl}/Get`, request);
  }

  addSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request('POST', `${this.SubscriptionPlanUrl}/Add`, subscriptionPlan);
  }

  editSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request('POST', `${this.SubscriptionPlanUrl}/Edit`, subscriptionPlan);
  }

  deleteSubscriptionPlan(id: number): Observable<any> {
    return this.apiCall.request('POST', `${this.SubscriptionPlanUrl}/Delete/${id}`, {})
  }

}
