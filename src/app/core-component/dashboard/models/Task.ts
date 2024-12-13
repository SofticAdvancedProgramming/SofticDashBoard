export interface Task
{
    id:number;
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
}