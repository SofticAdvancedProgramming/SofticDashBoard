import { environment } from "../environment/environment";


export const TasksAssignmentController = {

    Get: `${environment.apiBaseUrl}TasksAssignment/Get`,
    Add: `${environment.apiBaseUrl}TasksAssignment/Add`,
    Edit: `${environment.apiBaseUrl}TasksAssignment/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TasksAssignment/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TasksAssignment/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TasksAssignment/${id}/${companyId}`,
    Count: `${environment.apiBaseUrl}Tasks/TasksAssignment`,

};