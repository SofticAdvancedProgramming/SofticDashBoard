import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCall {
  
  constructor(private http: HttpClient) {}

  private getHeaders(headers?: HttpHeaders): HttpHeaders {
    let token = localStorage.getItem('token');
    let httpHeaders = headers || new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      httpHeaders = httpHeaders.set('Authorization', `Bearer ${token}`);
    }
    return httpHeaders;
  }

  request<T>(url: string, method: string, body?: any, headers?: HttpHeaders): Observable<T> {
    let options = {
      headers: this.getHeaders(headers)
    };

    switch (method.toLowerCase()) {
      case 'get':
        return this.http.get<T>(url, options);
      case 'post':
        return this.http.post<T>(url, body, options);
      case 'put':
        return this.http.put<T>(url, body, options);
      case 'delete':
        return this.http.delete<T>(url, options);
      default:
        throw new Error(`Unsupported request method: ${method}`);
    }
  }
}
