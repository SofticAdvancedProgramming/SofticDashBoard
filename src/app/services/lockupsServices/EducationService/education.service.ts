import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class EducationService {
  private universityUrl = `${environment.apiBaseUrl}University`;
  private certificateTypeUrl = `${environment.apiBaseUrl}CertificateType`;

  constructor(private apiCall: ApiCall) {}

  // University methods
  getUniversities(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.universityUrl}/Get`, 'post', request, headers);
  }

  addUniversity(university: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.universityUrl}/Add`, 'post', university, headers);
  }

  editUniversity(university: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.universityUrl}/Edit`, 'post', university, headers);
  }

  deleteUniversity(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.universityUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }

  // CertificateType methods
  getCertificateTypes(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.certificateTypeUrl}/Get`, 'post', request, headers);
  }

  addCertificateType(certificateType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.certificateTypeUrl}/Add`, 'post', certificateType, headers);
  }

  editCertificateType(certificateType: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.certificateTypeUrl}/Edit`, 'post', certificateType, headers);
  }

  deleteCertificateType(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.certificateTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
