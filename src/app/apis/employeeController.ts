import { environment } from "../environment/environment";

 
export const employeeController = {
  loadEmployees: `${environment.apiBaseUrl}Employee/Get`,
  addEmployee: `${environment.apiBaseUrl}Employee/Add`,
  assignToPosition: `${environment.apiBaseUrl}Employee/AssginPosition`,
  assignToDepartment: `${environment.apiBaseUrl}Employee/AssginDepartment`,
  assignToBranch: `${environment.apiBaseUrl}Employee/AssginBranch`,
  assignShift: `${environment.apiBaseUrl}Employee/AssginShift`,
  deleteEmployee: (id: number, companyId: number) => `${environment.apiBaseUrl}Employee/Delete/${id}/${companyId}`,
  loadEmployeeById: `${environment.apiBaseUrl}Employee/Get`,
};
