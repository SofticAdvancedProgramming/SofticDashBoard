import { BaseModel, EntitySC } from "../common/EntitySC";
export interface ToDoItemSC extends EntitySC{
  taskId?:number;
  description?: string;
  statusId?: number;
  employeeId?: number,
  departmentId?: number
}
export interface ToDoItemModel extends BaseModel{
  startDate: string | null;
  dueDate: string | null;
  taskName: string;
  employeeName: string;
  profileImage: string;
  departmentIds: number[];
  taskId: number;
  description: string;
  statusId: number;
  employeeId: number;
}
