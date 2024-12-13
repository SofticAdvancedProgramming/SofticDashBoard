import { environment } from "../environment/environment";


export const ToDoItemController = {

    Get: `${environment.apiBaseUrl}ToDoItem/Get`,
    Add: `${environment.apiBaseUrl}ToDoItem/Add`,
    Edit: `${environment.apiBaseUrl}ToDoItem/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/ToDoItem/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/ToDoItem/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/ToDoItem/${id}/${companyId}`,
    Count: `${environment.apiBaseUrl}Tasks/ToDoItem`,

};