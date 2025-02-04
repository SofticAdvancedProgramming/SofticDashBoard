import { Routes } from "@angular/router";

export const companyDetailsRoute: Routes = [
  {path:'' ,redirectTo:'profile-details',pathMatch:'full'},

  {
    path: 'profile-details',
    loadComponent: () => import('./profile-details/profile-details.component')
      .then(m => m.ProfileDetailsComponent)
  },


  {
    path: 'branches',
    loadComponent: () => import('./branches/branches.component')
      .then(m => m.BranchesComponent)
  },

  {
    path: 'department',
    loadComponent: () => import('./department/department.component')
      .then(m => m.DepartmentComponent)
  }



]
