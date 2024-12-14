import { Routes } from '@angular/router';
import { HomeComponent } from './core-component/dashboard/home/home.component';
import { DashboardLayoutComponent } from './core-component/layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './core-component/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core-component/authentication/login/login.component';
import { ResetPasswordComponent } from './core-component/authentication/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './core-component/authentication/forget-password/forget-password.component';
import { IndexComponent } from './core-component/dashboard/company/index/index.component';
import { AddCompanyComponent } from './core-component/dashboard/company/add-company/add-company.component';
import { AddAdminComponent } from './core-component/dashboard/company/add-admin/add-admin.component';
import { GeneralLookupsComponent } from './core-component/dashboard/setting/general-lookups/general-lookups.component';
import { SubscriptionPlanManagmentComponent } from './core-component/dashboard/setting/Lockups/subscription-plan-managment/subscription-plan-managment.component';
import { LocationManagmentComponent } from './core-component/dashboard/setting/Lockups/location-managment/location-managment.component';
import { ProfileComponent } from './core-component/dashboard/profile/index/profile.component';
import { EditProfileComponent } from './core-component/dashboard/profile/edit-profile/edit-profile.component';
import { CompanyDetailsComponent } from './core-component/dashboard/company/company-details/company-details.component';
import { ProfileDetailsComponent } from './core-component/dashboard/company/components/profile-details/profile-details.component';
import { AddPositionComponent } from './core-component/dashboard/company/components/position/add-position/add-position.component';
import { DepartmentDetailsComponent } from './core-component/dashboard/company/components/department/department-details/department-details.component';
import { AddDepartmentComponent } from './core-component/dashboard/company/components/department/add-department/add-department.component';
import { DepartmentOverviewComponent } from './core-component/dashboard/company/components/department/department-overview/department-overview.component';
import { PositionTypeManagmentComponent } from './core-component/dashboard/setting/Lockups/position-type-managment/position-type-managment.component';
import { DepartmentManagmentComponent } from './core-component/dashboard/setting/Lockups/department-managment/department-managment.component';
import { BranchManagmentComponent } from './core-component/dashboard/setting/Lockups/branch-managment/branch-managment.component';
import { ViewEmployeesComponent } from './core-component/dashboard/employee/view-employees/view-employees.component';
import { AddEmployeeComponent } from './core-component/dashboard/employee/add-employee/add-employee.component';
import { OrganizationChartsComponent } from './core-component/dashboard/organization-charts/organization-charts.component';
import { AuthGuard } from './core/guard/auth.guard';
import { EmployeeDetailsComponent } from './core-component/dashboard/employee/employee-details/employee-details.component';
import { NoPermissionComponent } from './common-component/no-permission/no-permission.component';
import { ngxPermissionsGuard } from 'ngx-permissions';
import { SalaryTypeComponent } from './core-component/dashboard/setting/Lockups/salary-type/salary-type.component';
import { ComplaintsSuggestionsComponent } from './core-component/dashboard/complaints-suggestions/complaints-suggestions.component';
import { ComplainSuggestionDetailsComponent } from './core-component/dashboard/complaints-suggestions/complain-suggestion-details/complain-suggestion-details.component';
import { AddLocationComponent } from './core-component/dashboard/employee/add-location/add-location.component';
import { HomeIndexComponent } from './core-component/dashboard/homeIndex/home.component';
import { CurrencyTypeComponent } from './core-component/dashboard/setting/Lockups/currency-type/currency-type.component';
import { BenefitTypeComponent } from './core-component/dashboard/setting/Lockups/benefit-type/benefit-type.component';
import { AssetsIndexComponent } from './core-component/dashboard/assets/assets-index/assets-index.component';
import { AssetsCategoryComponent } from './core-component/dashboard/setting/Lockups/assets-category/assets-category.component';
import { AddAssetsComponent } from './core-component/dashboard/assets/add-assets/add-assets.component';
import { ShowAssetsComponent } from './core-component/dashboard/assets/show-assets/show-assets.component';
import { AssetsDetailsComponent } from './core-component/dashboard/assets/assets-details/assets-details.component';
import { RelatedAssetsComponent } from './core-component/dashboard/setting/Lockups/relatedAssrts/related-assets/related-assets.component';
import { TasksIndexComponent } from './core-component/dashboard/Tasks/task-index/tasks-index.component';
import { AddTaskComponent } from './core-component/dashboard/Tasks/add-task/add-task.component';
import { TaskDetailsComponent } from './core-component/dashboard/Tasks/task-details/task-details.component';

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
      { path: '', redirectTo: 'HomeIndex', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'indexCompany', component: IndexComponent },
      { path: 'addCompany', component: AddCompanyComponent },
      { path: 'add-admin', component: AddAdminComponent },
      { path: 'generalLookups', component: GeneralLookupsComponent  ,canActivate: [ngxPermissionsGuard], data: { permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'SubscriptionPlan', component: SubscriptionPlanManagmentComponent },
      { path: 'addressManagement', component: LocationManagmentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'EditProfile', component: EditProfileComponent },
      { path: 'company/:companyId', component: CompanyDetailsComponent },
      { path: 'ProfileDetails', component: ProfileDetailsComponent },
      { path: 'AddPosition', component: AddPositionComponent },
      { path: 'DepartmentDetails', component: DepartmentDetailsComponent },
      { path: 'AddDepartment', component: AddDepartmentComponent },
      { path: 'HomeIndex', component: HomeIndexComponent },
      { path: 'DepartmentOverview', component: DepartmentOverviewComponent  },
      { path: 'PositionTypeManagment', component: PositionTypeManagmentComponent  },
      { path: 'salary-type', component: SalaryTypeComponent  },
      { path: 'currency-type', component: CurrencyTypeComponent  },
      { path: 'departmentManagment', component: DepartmentManagmentComponent  },
      { path: 'branchManagment', component: BranchManagmentComponent  },
      { path: 'ViewEmployees', component: ViewEmployeesComponent ,canActivate: [ngxPermissionsGuard], data: { permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'AddEmployee', component: AddEmployeeComponent  },
      { path: 'OrganizationCharts', component: OrganizationChartsComponent  },
      { path: 'BenefitType', component: BenefitTypeComponent  },
      { path: 'ComplaintsSuggestions', component: ComplaintsSuggestionsComponent  },
      { path: 'ComplainSuggestionDetails/:id', component: ComplainSuggestionDetailsComponent },
      { path: 'employee-details/:id', component: EmployeeDetailsComponent },
      { path: 'AssetsIndex', component: AssetsIndexComponent },
      { path: 'employee-locations/:id', component: AddLocationComponent },
      { path: 'assetsCategory', component: AssetsCategoryComponent},
      { path: 'relatedAssets', component: RelatedAssetsComponent},
      { path: 'AddAssets', component: AddAssetsComponent },
      { path: 'ShowAssets', component: ShowAssetsComponent },
      { path: 'ShowAssets/:isAssined', component: ShowAssetsComponent },
      { path: 'AssetsDetails/:id', component: AssetsDetailsComponent },
      { path: 'employee-locations/:id', component: AddLocationComponent },
      { path: 'tasks', component: TasksIndexComponent},
      { path: 'tasks/addnew', component: AddTaskComponent},
      { path: 'tasks/details/:id', component: TaskDetailsComponent},

        ],
  },{
    path: 'no-permission',
    component: NoPermissionComponent, pathMatch: 'full',
  },
];
