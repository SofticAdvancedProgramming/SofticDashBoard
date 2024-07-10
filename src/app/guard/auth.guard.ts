import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "../services/authenticationService/authentication.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
