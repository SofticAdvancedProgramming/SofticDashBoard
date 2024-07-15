import { Component } from '@angular/core';
import { FileService } from '../../../../../services/lockupsServices/FileService/file.service';

@Component({
  selector: 'app-file-managment',
  standalone: true,
  imports: [],
  templateUrl: './file-managment.component.html',
  styleUrl: './file-managment.component.css'
})
export class FileManagmentComponent {

  fileDescriptions: any[] = [];
  fileDescriptionTypes: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    fileDescription: {
      load: 'getFileDescriptions',
      add: 'addFileDescription',
      edit: 'editFileDescription',
      delete: 'deleteFileDescription',
      data: 'fileDescriptions'
    },
    fileDescriptionType: {
      load: 'getFileDescriptionTypes',
      add: 'addFileDescriptionType',
      edit: 'editFileDescriptionType',
      delete: 'deleteFileDescriptionType',
      data: 'fileDescriptionTypes'
    }
  };

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.loadEntities('fileDescription');
    this.loadEntities('fileDescriptionType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof FileService;
    (this.fileService[methodName] as Function)().subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
        }
      },
      (error: any) => {
        console.error(`Error fetching ${entity}`, error);
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof FileService;
    (this.fileService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error adding ${entity}`, error);
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof FileService;
    (this.fileService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number, companyId: number): void {
    const methodName = this.entityTypes[entity].delete as keyof FileService;
    (this.fileService[methodName] as Function)(id, companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }
}