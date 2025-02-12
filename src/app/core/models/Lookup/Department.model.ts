import { EntitySC } from "../common/EntitySC";

export interface DepartmentSC extends EntitySC{
  branchId?: number;
  name?: string;
  shortName?: string;
  nameAr?: string;
  description?: string;
  descriptionAr?: string;
  manager?: string;
  isHR?: boolean;
  isFinancial?: boolean;
  isCentralized?: boolean;
}
