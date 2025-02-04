import { Routes } from "@angular/router";

export const companyDetailsRoute: Routes = [
  {
    path:'',
    loadComponent:()=>import('./company-details.component').then(c=>c.CompanyDetailsComponent)
  },
  {
    path:'branches',
    loadComponent:()=> import('./branches/branches.component').then(c=>c.BranchesComponent)
  },

]
