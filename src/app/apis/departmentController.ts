import { environment } from "../environment/environment";


export const departmentController = {
    getDepartment: `${environment.apiBaseUrl}Department/Get`,
    addDepartment: `${environment.apiBaseUrl}Department/Add`,
    editDepartment: `${environment.apiBaseUrl}Department/Edit`,
    deleteDepartment: (id: number, companyId: number) => `${environment.apiBaseUrl}Department/Delete/${id}/${companyId}`,
    activateDepartment: (id: number, companyId: number) => `${environment.apiBaseUrl}Department/Activate/${id}/${companyId}`,
    deactivateDepartment: (id: number, companyId: number) => `${environment.apiBaseUrl}Department/DeActivate/${id}/${companyId}`,
};
