import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AttachmentCategoryService {
  private attachmentCategoryUrl = `${environment.apiBaseUrl}AttachmentCategory`;

  constructor(private apiCall: ApiCall) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // AttachmentCategory methods
  getAttachmentCategories(request: any = {}): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.attachmentCategoryUrl}/Get`, 'post', request, headers);
  }

  addAttachmentCategory(attachmentCategory: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.attachmentCategoryUrl}/Add`, 'post', attachmentCategory, headers);
  }

  editAttachmentCategory(attachmentCategory: any): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.attachmentCategoryUrl}/Edit`, 'post', attachmentCategory, headers);
  }

  deleteAttachmentCategory(id: number, companyId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.apiCall.request<any>(`${this.attachmentCategoryUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
