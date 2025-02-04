import { Routes } from "@angular/router";

export const companyDetailsRoute: Routes = [
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
