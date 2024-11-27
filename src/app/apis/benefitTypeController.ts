import { environment } from "../environment/environment";

export const BenefitType = {
  Get: `${environment.apiBaseUrl}BenefitType/Get`,
  Add: `${environment.apiBaseUrl}BenefitType/Add`,
  Edit: `${environment.apiBaseUrl}BenefitType/Edit`,
  Delete: (id: number, companyId: number) => `${environment.apiBaseUrl}BenefitType/Delete/${id}/${companyId}`,
};
