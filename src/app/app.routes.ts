import { Routes } from '@angular/router';
import { HomeComponent } from './core/dashboard/home/home.component';
import { DashboardLayoutComponent } from './core/layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/authentication/login/login.component';
import { RegistrationComponent } from './core/authentication/registration/registration.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './core/authentication/forget-password/forget-password.component';
import { AuthGuard } from './guard/auth.guard';
import { IndexComponent } from './core/dashboard/company/index/index.component';
import { AddCompanyComponent } from './core/dashboard/company/add-company/add-company.component';
import { AddAdminComponent } from './core/dashboard/company/add-admin/add-admin.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'ResetPassword', component: ResetPasswordComponent },
      { path: 'forgetPassword', component: ForgetPasswordComponent },
    ],
  }, {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'indexCompany', component: IndexComponent },
      { path: 'addCompany', component: AddCompanyComponent },
      { path: 'addAdmin', component: AddAdminComponent },
    ],
  },
];
