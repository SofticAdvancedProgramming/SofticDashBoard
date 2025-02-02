export interface Task
{
    id:number;
    data:any;
    name: string;
    description: string;
    dueDate: string;
    assignees: { avatar: string }[];
    actualCost?:number;
    additionalCost?:number;
    companyId?:number;
    costScore?:number;
    duration?:number;
    endDate?:Date;
    initialBudget?:number;
    laborCost?:number;
    materialCost?:number;
    qualityScore?:number;
    serviceCost?:number;
    startDate?:Date;
    statusId?:number;
    timeScore?:number;
    taskId: number;
    createdBy:number
}
export enum tasksStatus {
    Todo = 1,
    InProgress = 2,
    SubmitForReview = 3,
    Done = 4,
    Archived = 5,
  }
  export interface TaskAssignment {
    employeeName: string;
    profileImage: string;
    task: Task;
    reason: string | null;
    taskId: number;
    employeeId: number;
    id: number;
    companyId: number;
    statusId:number;
  }