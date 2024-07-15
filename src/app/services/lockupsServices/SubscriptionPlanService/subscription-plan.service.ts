import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  private SubscriptionPlanUrl = `${environment.apiBaseUrl}SubscriptionPlan`;

  constructor(private apiCall: ApiCall) {}

  getSubscriptionPlan(request: any = {}): Observable<any> {
    return this.apiCall.request<any>(`${this.SubscriptionPlanUrl}/Get`, 'post', request);
  }

  addSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request<any>(`${this.SubscriptionPlanUrl}/Add`, 'post', subscriptionPlan);
  }

  editSubscriptionPlan(subscriptionPlan: any): Observable<any> {
    return this.apiCall.request<any>(`${this.SubscriptionPlanUrl}/Edit`, 'post', subscriptionPlan);
  }

  deleteSubscriptionPlan(id: number): Observable<any> {
    return this.apiCall.request<any>(`${this.SubscriptionPlanUrl}/Delete/${id}`, 'post', {});
  }
}
