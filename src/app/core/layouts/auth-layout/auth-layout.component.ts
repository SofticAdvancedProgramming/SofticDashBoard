import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ForgetPasswordComponent } from '../../authentication/forget-password/forget-password.component';
import { LoginComponent } from '../../authentication/login/login.component';
import { RegistrationComponent } from '../../authentication/registration/registration.component';
import { ResetPasswordComponent } from '../../authentication/reset-password/reset-password.component';
import { AuthFooterComponent } from '../../authentication/footer/footer.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    AuthFooterComponent
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
