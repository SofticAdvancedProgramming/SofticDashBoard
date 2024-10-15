import { environment } from "../environment/environment";

 
export const userController = {
  loadPersonalInformation: `${environment.apiBaseUrl}Users/GetPersonalInformation`,
  editPersonalInformation: `${environment.apiBaseUrl}Users/EditPersonalInformation`,
};
