import { BaseModel, EntitySC } from "../common/EntitySC";
import { TaskModel } from "./task.model";

export interface TaskAssignmentSC extends EntitySC{
  taskId?: number;
  taskCreatedBy?: number;
  employeeId?: number;
  todoEmployeeId?: number;
  taskName?: string;
  taskCode?: string;
  reason?: string;
  isDone?: boolean;
}


export interface TaskAssignmentModel extends BaseModel{
  taskId: number;
  employeeId: number;
  reason?: string;
  employeeName?: string;
  profileImage?: string;
  task:TaskModel
}
