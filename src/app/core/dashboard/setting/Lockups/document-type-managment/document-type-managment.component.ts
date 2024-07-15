import { Component } from '@angular/core';
import { DocumentTypeService } from '../../../../../services/lockupsServices/DocumentTypeService/document-type.service';

@Component({
  selector: 'app-document-type-managment',
  standalone: true,
  imports: [],
  templateUrl: './document-type-managment.component.html',
  styleUrl: './document-type-managment.component.css'
})
export class DocumentTypeManagmentComponent {

  documentTypes: any[] = [];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    documentType: {
      load: 'getDocumentTypes',
      add: 'addDocumentType',
      edit: 'editDocumentType',
      delete: 'deleteDocumentType',
      data: 'documentTypes'
    }
  };

  constructor(private documentTypeService: DocumentTypeService) {}

  ngOnInit(): void {
    this.loadEntities('documentType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof DocumentTypeService;
    (this.documentTypeService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof DocumentTypeService;
    (this.documentTypeService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof DocumentTypeService;
    (this.documentTypeService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof DocumentTypeService;
    (this.documentTypeService[methodName] as Function)(id, companyId).subscribe(
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
