import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private fileDescriptionUrl = `${environment.apiBaseUrl}FileDescription`;
  private fileDescriptionTypeUrl = `${environment.apiBaseUrl}FileDescriptionType`;

  constructor(private apiCall: ApiCall) {}

  // FileDescription methods
  getFileDescriptions(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionUrl}/Get`, 'post', request, headers);
  }

  addFileDescription(fileDescription: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionUrl}/Add`, 'post', fileDescription, headers);
  }

  editFileDescription(fileDescription: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionUrl}/Edit`, 'post', fileDescription, headers);
  }

  deleteFileDescription(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }

  // FileDescriptionType methods
  getFileDescriptionTypes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionTypeUrl}/Get`, 'post', request, headers);
  }

  addFileDescriptionType(fileDescriptionType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionTypeUrl}/Add`, 'post', fileDescriptionType, headers);
  }

  editFileDescriptionType(fileDescriptionType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionTypeUrl}/Edit`, 'post', fileDescriptionType, headers);
  }

  deleteFileDescriptionType(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.fileDescriptionTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
