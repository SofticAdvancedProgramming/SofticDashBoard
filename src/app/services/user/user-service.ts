// import { HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { company } from '../../../models/company';
// import { environment } from '../../environment/environment';
// import { ApiCall } from '../apiCall/apicall.service';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private apiUrl = `${environment.apiBaseUrl}Auth/GetCurrentUser`;
//   constructor(private apiCall: ApiCall) {}
//   GetCurrentUser(data:any): Observable<any[]> {
//     const token = localStorage.getItem('token'); // Retrieve the stored token
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     });
//     return this.apiCall.request<any>(this.apiUrl, 'post', data, headers);
//   }
// }
