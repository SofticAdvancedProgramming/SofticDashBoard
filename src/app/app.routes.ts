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
import { GeneralLookupsComponent } from './core/dashboard/setting/general-lookups/general-lookups.component';
import { SubscriptionPlanManagmentComponent } from './core/dashboard/setting/Lockups/subscription-plan-managment/subscription-plan-managment.component';
import { LocationManagmentComponent } from './core/dashboard/setting/Lockups/location-managment/location-managment.component';
import { ProfileComponent } from './core/dashboard/profile/index/profile.component';
import { EditProfileComponent } from './core/dashboard/profile/edit-profile/edit-profile.component';
import { CompanyDetailsComponent } from './core/dashboard/company/company-details/company-details.component';
import { ProfileDetailsComponent } from './core/dashboard/company/components/profile-details/profile-details.component';
import { AddPositionComponent } from './core/dashboard/company/components/position/add-position/add-position.component';
import { DepartmentDetailsComponent } from './core/dashboard/company/components/department/department-details/department-details.component';
import { AddDepartmentComponent } from './core/dashboard/company/components/department/add-department/add-department.component';
import { DepartmentOverviewComponent } from './core/dashboard/company/components/department/department-overview/department-overview.component';

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
      { path: 'AddAdmin', component: AddAdminComponent },
      { path: 'generalLookups', component: GeneralLookupsComponent },
      { path: 'SubscriptionPlan', component: SubscriptionPlanManagmentComponent },
      { path: 'addressManagement', component: LocationManagmentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'EditProfile', component: EditProfileComponent },
      { path: 'company/:companyId', component: CompanyDetailsComponent },
      { path: 'ProfileDetails', component: ProfileDetailsComponent },
      { path: 'AddPosition', component: AddPositionComponent },
      { path: 'DepartmentDetails', component: DepartmentDetailsComponent },
      { path: 'AddDepartment', component: AddDepartmentComponent },
      { path: 'DepartmentOverview', component: DepartmentOverviewComponent  },
    ],
  },
];
