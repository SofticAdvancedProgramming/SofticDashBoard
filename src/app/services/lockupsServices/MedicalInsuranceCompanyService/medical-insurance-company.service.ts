import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiCall } from '../../apiCall/apicall.service';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class MedicalInsuranceCompanyService {
  private medicalInsuranceCompanyUrl = `${environment.apiBaseUrl}MedicalInsuranceCompany`;

  constructor(private apiCall: ApiCall) {}

  // MedicalInsuranceCompany methods
  getMedicalInsuranceCompanies(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.medicalInsuranceCompanyUrl}/Get`, 'post', request, headers);
  }

  addMedicalInsuranceCompany(medicalInsuranceCompany: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.medicalInsuranceCompanyUrl}/Add`, 'post', medicalInsuranceCompany, headers);
  }

  editMedicalInsuranceCompany(medicalInsuranceCompany: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.medicalInsuranceCompanyUrl}/Edit`, 'post', medicalInsuranceCompany, headers);
  }

  deleteMedicalInsuranceCompany(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.medicalInsuranceCompanyUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }
}
