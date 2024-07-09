export interface EmployeeReference {
  name: string;
  rRelationShipID: number;
  telephone: string;
  fullAddress: string;
  nearBy: string;
  street: string;
  floor: number;
  unit: string;
  buildingNo: string;
  isEmployee: boolean;
  employeeId: number;
  refernceTypeId: number;
  id?:number
}
export interface EmployeeReferenceType {
  id?: number;
  name: string,
nameAr: string
}
