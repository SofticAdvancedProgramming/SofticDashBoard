import { environment } from "../environment/environment";


export const employeeController = {
  loadEmployees: `${environment.apiBaseUrl}Employee/Get`,
  addEmployee: `${environment.apiBaseUrl}Employee/Add`,
  assignToPosition: `${environment.apiBaseUrl}Employee/AssginPosition`,
  assignToDepartment: `${environment.apiBaseUrl}Employee/AssginDepartment`,
  assignToBranch: `${environment.apiBaseUrl}Employee/AssginBranch`,
  employeeSalary:`${environment.apiBaseUrl}EmployeeSalary`,
  assginSalary:`${environment.apiBaseUrl}Employee/AssginSalary`,
  assignShift: `${environment.apiBaseUrl}Employee/AssginShift`,
  deleteEmployee: (id: number, companyId: number) => `${environment.apiBaseUrl}Employee/Delete/${id}/${companyId}`,
  loadEmployeeById: `${environment.apiBaseUrl}Employee/Get`,
  loadEmployeeAttendanceLocation:`${environment.apiBaseUrl}EmployeeAttendanceLocation/Get`,
  assignEmployeeLocation:`${environment.apiBaseUrl}EmployeeAttendanceLocation/Add`,
  removeEmployeeAttendanceLocation:(id: number, companyId: number) => `${environment.apiBaseUrl}EmployeeAttendanceLocation/Delete/${id}/${companyId}`,
  editEmployeeAttendanceLocation:`${environment.apiBaseUrl}EmployeeAttendanceLocation/Edit`
  GetEmployees: 'Employee/Get',

};
