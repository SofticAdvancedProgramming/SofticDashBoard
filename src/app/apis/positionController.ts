import { environment } from "../environment/environment";


export const positionController = {
    getPosition: `${environment.apiBaseUrl}Position/Get`,
    addPosition: `${environment.apiBaseUrl}Position/Add`,
    editPosition: `${environment.apiBaseUrl}Position/Edit`,
    deletePosition: (id: number, companyId: number) => `${environment.apiBaseUrl}Position/Delete/${id}/${companyId}`,
    activatePosition: (id: number, companyId: number) => `${environment.apiBaseUrl}Position/Activate/${id}/${companyId}`,
    deactivatePosition: (id: number, companyId: number) => `${environment.apiBaseUrl}Position/DeActivate/${id}/${companyId}`,
};
