export interface Position {
  companyId: number;
  departmentId: number;
  id?: number;
  name: string;
  nameAr: string;
  positionManagerId: number | null;
  positionTypeId: number;
  isActive?:boolean
}
