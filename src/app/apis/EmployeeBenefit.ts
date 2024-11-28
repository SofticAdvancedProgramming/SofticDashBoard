import { environment } from "../environment/environment";


export const EmployeeBenefitController = {
  
  addEmployeeBenefit:`${environment.apiBaseUrl}EmployeeBenefit/Add`,
  getEmployeeBenefit:`${environment.apiBaseUrl}EmployeeBenefit/Get`
};
