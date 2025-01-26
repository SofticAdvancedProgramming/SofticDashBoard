import { environment } from "../environment/environment";

export const EmployeeAttendances = {
    Get: `${environment.apiBaseUrl}EmployeeAttendances/Get`,
    GetChart: `${environment.apiBaseUrl}EmployeeAttendances/GetChart`,
    GetAttendanceDetails: `${environment.apiBaseUrl}EmployeeAttendances/GetAttendanceDetails`,
}
