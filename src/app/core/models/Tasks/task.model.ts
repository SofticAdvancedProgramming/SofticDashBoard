
import { BaseModel, EntitySC } from "../common/EntitySC";
import { TaskAssignmentModel } from "./task-assignment.model";
import { TaskAttachmentModel } from "./task.attachment.model";
import { ToDoItemModel } from "./todo-item.model";

export interface TaskSC extends EntitySC{
  createdBy?: number;
  taskCode?: string;
  ids?: number[];
  name?: string;
  description?: string;
  startDate?: string;
  dueDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  initialBudget?: number;
  actualCost?: number;
  laborCost?: number;
  materialCost?: number;
  serviceCost?: number;
  additionalCost?: number;
  qualityScore?: number;
  timeScore?: number;
  costScore?: number;
  evaluationComment?: string;
  taskStatusId?: number;
  taskPriorityId?: number;
  progress?: number;
  isEvaluated?: boolean;
  departmentIds?: number[];
}
export interface TaskModel extends BaseModel{
  createdBy: number;
  name: string;
  description: string;
  taskCode: string;
  initialBudget: number;
  actualCost: number;
  statusId: number;
  priorityId: number;
  isGlobal: boolean;
  departmentIds: number[];
  branchId: number | null;
  startDate: string;
  dueDate: string | null;
  laborCost: number;
  materialCost: number;
  serviceCost: number;
  additionalCost: number;
  qualityScore: number;
  timeScore: number;
  costScore: number;
  evaluationComment: string | null;
  taskAssignments: TaskAssignmentModel[];
  toDoItems?: ToDoItemModel[];
  taskAttachments?: TaskAttachmentModel[];
  actualStartDate: string;
  actualEndDate: string | null;
  progress: number;
  priorityName: string | null;
  priorityNameAr: string | null;
  branchName: string | null;
  creatorName: string;
  teamName: string | null;
  isEvaluated: boolean;
}
