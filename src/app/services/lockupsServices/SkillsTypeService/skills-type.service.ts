import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SkillsTypeService {
  private skillsTypeUrl = `${environment.apiBaseUrl}SkillsType`;

  constructor(private apiCall: ApiCall) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // SkillsType methods
  getSkillsTypes(request: any = {}): Observable<any> {
    return this.apiCall.request<any>(`${this.skillsTypeUrl}/Get`, 'post', request, this.getHeaders());
  }

  addSkillsType(skillsType: any): Observable<any> {
    return this.apiCall.request<any>(`${this.skillsTypeUrl}/Add`, 'post', skillsType, this.getHeaders());
  }

  editSkillsType(skillsType: any): Observable<any> {
    return this.apiCall.request<any>(`${this.skillsTypeUrl}/Edit`, 'post', skillsType, this.getHeaders());
  }

  deleteSkillsType(id: number, companyId: number): Observable<any> {
    return this.apiCall.request<any>(`${this.skillsTypeUrl}/Delete/${id}/${companyId}`, 'post', {}, this.getHeaders());
  }
}
