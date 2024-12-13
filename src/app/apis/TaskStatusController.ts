import { environment } from "../environment/environment";


export const TaskStatusController = {

    Get: `${environment.apiBaseUrl}TaskStatus/Get`,
    Add: `${environment.apiBaseUrl}TaskStatus/Add`,
    Edit: `${environment.apiBaseUrl}TaskStatus/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TaskStatus/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TaskStatus/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/TaskStatus/${id}/${companyId}`,
    Count: `${environment.apiBaseUrl}Tasks/TaskStatus`,

};