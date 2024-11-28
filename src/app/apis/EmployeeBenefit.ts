import { environment } from "../environment/environment";


export const EmployeeBenefitController = {
  
  add:`${environment.apiBaseUrl}EmployeeBenefit/Add`,
  get:`${environment.apiBaseUrl}EmployeeBenefit/Get`,
  Edit: `${environment.apiBaseUrl}EmployeeBenefit/Edit`,
  Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}EmployeeBenefit/Delete/${id}/${companyId}`,
};
