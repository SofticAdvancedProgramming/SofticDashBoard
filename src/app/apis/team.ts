import { environment } from "../environment/environment";

export const teamsController ={
    AddTeam: `${environment.apiBaseUrl}Team/Add`,
    getTeam: `${environment.apiBaseUrl}Team/Get`,
    editTeam: `${environment.apiBaseUrl}Team/Edit`,
    deleteTeam: (id: number, companyId: number) => `${environment.apiBaseUrl}Team/Delete/${id}/${companyId}`,

}