import { environment } from "../environment/environment";


export const TasksBaseController = {

    AssignTaskStatus: `${environment.apiBaseUrl}Tasks/AssignTaskStatus`,
    AssignCost: `${environment.apiBaseUrl}Tasks/AssignCost`,
    GetCost: `${environment.apiBaseUrl}Tasks/GetCost`,
    AssignEvaluation: `${environment.apiBaseUrl}Tasks/AssignEvaluation`,
    GetEvaluation:(id: number) => `${environment.apiBaseUrl}Tasks/GetEvaluation?taskId=${id}`,
    Get: `${environment.apiBaseUrl}Tasks/Get`,
    Add: `${environment.apiBaseUrl}Tasks/Add`,
    Edit: `${environment.apiBaseUrl}Tasks/Edit`,
    Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/Delete/${id}/${companyId}`,
    DeleteTodo: (id: number, companyId: number) => `${environment.apiBaseUrl}ToDoItem/Delete/${id}/${companyId}`,
    Activate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/Activate/${id}/${companyId}`,
    DeActivate: (id: number, companyId: number) => `${environment.apiBaseUrl}Tasks/DeActivate/${id}/${companyId}`,
    Count: `${environment.apiBaseUrl}Tasks/Count`,
    AssignTask:`${environment.apiBaseUrl}TaskAssignment/Add`
};
