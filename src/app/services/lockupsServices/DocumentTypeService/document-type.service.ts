import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService {
  private documentTypeUrl = `${environment.apiBaseUrl}DocumentType`;

  constructor(private apiCall: ApiCall) {}

  // DocumentType methods
  getDocumentTypes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.documentTypeUrl}/Get`, 'post', request, headers);
  }

  addDocumentType(documentType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.documentTypeUrl}/Add`, 'post', documentType, headers);
  }

  editDocumentType(documentType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.documentTypeUrl}/Edit`, 'post', documentType, headers);
  }

  deleteDocumentType(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.documentTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
