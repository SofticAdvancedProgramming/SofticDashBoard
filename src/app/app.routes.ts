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
import { TaskAnalyticsComponent } from './core-component/dashboard/Tasks/task-analytics/task-analytics.component';
import { RewarkDialogComponent } from './core-component/dashboard/components/rewark-dialog/rewark-dialog.component';
import { EvaluatoionComponent } from './core-component/dashboard/components/evaluatoion/evaluatoion.component';
import { EnhancedOrganizationChartComponent } from './core-component/dashboard/enhanced-organization-chart/enhanced-organization-chart.component';
import { AddRequestTypeComponent } from './core-component/dashboard/workflow/request-type/add-request-type/add-request-type.component';
import { RequestTypeIndexComponent } from './core-component/dashboard/workflow/request-type/request-type-index/request-type-index.component';
import { RequestTypeDetailsComponent } from './core-component/dashboard/workflow/request-type/request-type-details/request-type-details.component';

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
      { path: '', redirectTo: 'HomeIndex', pathMatch: 'full' ,data: { breadcrumb: 'Home' } },
      { path: 'home', component: HomeComponent ,data: { breadcrumb: 'Home' } },
      { path: 'indexCompany', component: IndexComponent  ,data: { breadcrumb: 'Home' }},
      { path: 'addCompany', component: AddCompanyComponent  ,data: { breadcrumb: 'Add Company' }},
      { path: 'add-admin', component: AddAdminComponent ,data: { breadcrumb: 'Add Admin' }},
      { path: 'generalLookups', component: GeneralLookupsComponent  ,canActivate: [ngxPermissionsGuard], data: { breadcrumb: 'settings',permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'SubscriptionPlan', component: SubscriptionPlanManagmentComponent, data: { breadcrumb: 'Subscription Plan' }},
      { path: 'addressManagement', component: LocationManagmentComponent , data: { breadcrumb: 'Location Management' }},
      { path: 'profile', component: ProfileComponent , data: { breadcrumb: 'Profile' }},
      { path: 'EditProfile', component: EditProfileComponent , data: { breadcrumb: 'Edit Profile' }},
      { path: 'company/:companyId', component: CompanyDetailsComponent , data: { breadcrumb: 'Comapny Details' }},
      { path: 'ProfileDetails', component: ProfileDetailsComponent , data: { breadcrumb: 'Profile Details' }},
      { path: 'AddPosition', component: AddPositionComponent , data: { breadcrumb: 'Add Position' }},
      { path: 'DepartmentDetails', component: DepartmentDetailsComponent , data: { breadcrumb: 'Department Details' }},
      { path: 'AddDepartment', component: AddDepartmentComponent , data: { breadcrumb: 'Add Department ' }},
      { path: 'HomeIndex', component: HomeIndexComponent , data: { breadcrumb: 'Home Index ' }},
      { path: 'DepartmentOverview', component: DepartmentOverviewComponent , data: { breadcrumb: 'Department Overview ' } },
      { path: 'PositionTypeManagment', component: PositionTypeManagmentComponent  , data: { breadcrumb: 'Position Type Management' } },
      { path: 'salary-type', component: SalaryTypeComponent  , data: { breadcrumb: 'Salary Type Management' }},
      { path: 'currency-type', component: CurrencyTypeComponent  , data: { breadcrumb: 'Currency Type Management' }},
      { path: 'departmentManagment', component: DepartmentManagmentComponent  , data: { breadcrumb: 'Department Management' }},
      { path: 'branchManagment', component: BranchManagmentComponent  , data: { breadcrumb: 'Branch Management' }},
      { path: 'ViewEmployees', component: ViewEmployeesComponent ,canActivate: [ngxPermissionsGuard], data: { breadcrumb: 'View Employees',permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'ViewEmployees/:postionId', component: ViewEmployeesComponent ,canActivate: [ngxPermissionsGuard], data: {breadcrumb: 'View Employees', permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'AddEmployee', component: AddEmployeeComponent , data: { breadcrumb: 'Add Employee' } },
      { path: 'OrganizationCharts', component: EnhancedOrganizationChartComponent , data: { breadcrumb: 'Organization Chart' } },
      { path: 'BenefitType', component: BenefitTypeComponent  , data: { breadcrumb: 'Benfit Types' }},
      { path: 'ComplaintsSuggestions', component: ComplaintsSuggestionsComponent , data: { breadcrumb: 'Complaints And Suggetions' } },
      { path: 'ComplainSuggestionDetails/:id', component: ComplainSuggestionDetailsComponent , data: { breadcrumb: 'Complaints And Suggetions Details' }},
      { path: 'employee-details/:id', component: EmployeeDetailsComponent , data: { breadcrumb: 'Employee Details' }},
      { path: 'AssetsIndex', component: AssetsIndexComponent, data: { breadcrumb: 'Assets' }},
      { path: 'employee-locations/:id', component: AddLocationComponent , data: { breadcrumb: 'Employee Location' }},
      { path: 'assetsCategory', component: AssetsCategoryComponent , data: { breadcrumb: 'Asset Category' }},
      { path: 'relatedAssets', component: RelatedAssetsComponent , data: { breadcrumb: 'Related Assets' }},
      { path: 'AddAssets', component: AddAssetsComponent , data: { breadcrumb: 'Add Assets' }}, 
      { path: 'ShowAssets', component: ShowAssetsComponent  , data: { breadcrumb: 'Show Assets' }},
      { path: 'ShowAssets/:isAssined', component: ShowAssetsComponent , data: { breadcrumb: 'Show Assets' }},
      { path: 'AssetsDetails/:id', component: AssetsDetailsComponent , data: { breadcrumb: 'Asset Details' }},
      { path: 'employee-locations/:id', component: AddLocationComponent , data: { breadcrumb: 'Employee Location' }},
      { path: 'tasks', component: TasksIndexComponent , data: { breadcrumb: 'Tasks' }},
      { path: 'tasks/addnew', component: AddTaskComponent , data: { breadcrumb: 'Add Task' }},
      { path: 'tasks/addnew/:id', component: AddTaskComponent , data: { breadcrumb: 'Edit Task' }},
      { path: 'tasks/details/:id', component: TaskDetailsComponent , data: { breadcrumb: 'Task Details' }},
      { path: 'tasks/analytics/:id', component: TaskAnalyticsComponent , data: { breadcrumb: 'Task Analytics' }},
      { path: 'tasks/evaluation', component: EvaluatoionComponent , data: { breadcrumb: 'Task Evaluation' }},
      { path: 'tasks/rework', component: RewarkDialogComponent , data: { breadcrumb: 'Task Rework' }},
      { path: 'workflow/Request-type', component:  RequestTypeIndexComponent , data: { breadcrumb: 'Request Types' }},
      { path: 'workflow/Request-type/addRequest-type', component: AddRequestTypeComponent , data: { breadcrumb: 'Add Request Type' }},
      { path: 'workflow/Request-type/details/:id', component: RequestTypeDetailsComponent , data: { breadcrumb: 'Request Types Details' }},

        ],
  },{
    path: 'no-permission',
    component: NoPermissionComponent, pathMatch: 'full',
  },
];
