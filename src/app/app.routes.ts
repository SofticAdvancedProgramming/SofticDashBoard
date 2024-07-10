import { Routes } from '@angular/router';
import { HomeComponent } from './core/dashboard/home/home.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { RegistrationComponent } from './core/authentication/registration/registration.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './core/authentication/forget-password/forget-password.component';
import { CompaniesComponent } from './core/dashboard/companies/companies.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
      { path: 'ResetPassword', component: ResetPasswordComponent },
      { path: 'forgetPassword', component: ForgetPasswordComponent },
    ],
  }, {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'Companies', component: CompaniesComponent },
    ],
  },
];
