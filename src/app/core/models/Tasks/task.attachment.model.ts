import { BaseModel, EntitySC } from "../common/EntitySC";

export interface TaskAttachmentSC extends EntitySC{
  taskId?:number;
}


export interface TaskAttachmentModel extends BaseModel{
  taskId:number;
  file: string,
  fileExtension: string
}
