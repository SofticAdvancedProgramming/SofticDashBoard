import { environment } from "../environment/environment";


export const ToDoItemController = {

    Get: `${environment.apiBaseUrl}ToDoItem/Get`,
    Add: `${environment.apiBaseUrl}ToDoItem/Add`,
    Edit: `${environment.apiBaseUrl}ToDoItem/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}ToDoItem/Delete/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}ToDoItem/Activate/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}ToDoItem/DeActivate/${id}/${companyId}`,
    Count: `${environment.apiBaseUrl}Tasks/ToDoItem`,

};