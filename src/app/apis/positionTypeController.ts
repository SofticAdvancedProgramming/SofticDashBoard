import { environment } from "../environment/environment";

 
export const positionTypeController = {
  getPositionTypes: `${environment.apiBaseUrl}PositionType/Get`,
  addPositionType: `${environment.apiBaseUrl}PositionType/Add`,
  editPositionType: `${environment.apiBaseUrl}PositionType/Edit`,
  deletePositionType: (id: number, companyId: number) => `${environment.apiBaseUrl}PositionType/Delete/${id}/${companyId}`,
};
