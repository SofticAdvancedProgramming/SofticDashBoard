import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AccessToken } from '../../../models/token';
 


@Injectable({
  providedIn: 'root',
})
export class WebstorgeService {

  constructor(private router: Router) { }


  public RefreshToken(tokens: AccessToken): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('accessToken', tokens.access.token);
  }

  public Logout(): void {
    localStorage.clear();
    this.router.navigate(['/auth/signin']);
  }
}
