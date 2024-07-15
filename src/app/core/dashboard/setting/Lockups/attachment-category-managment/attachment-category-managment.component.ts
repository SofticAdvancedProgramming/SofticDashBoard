import { Component } from '@angular/core';
import { AttachmentCategoryService } from '../../../../../services/lockupsServices/AttachmentCategoryService/attachment-category.service';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { AttachmentCategory } from '../../../../../../models/attachment';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';

@Component({
  selector: 'app-attachment-category-managment',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent],
  templateUrl: './attachment-category-managment.component.html',
  styleUrls: ['./attachment-category-managment.component.css']
})
export class AttachmentCategoryManagmentComponent {
  attachmentCategories: any[] = [];
  columns: string[] = ['id','name', 'nameAr', 'description', 'descriptionAr'];

  // for popup
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'descriptionAr', label: 'DescriptionAr', type: 'text', required: true },
  ];

  formData:any;
  isEdit = false;
  modalId = 'AddEditAttachmentCategory';
  companyId: number = 0;

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    attachmentCategory: {
      load: 'getAttachmentCategories',
      add: 'addAttachmentCategory',
      edit: 'editAttachmentCategory',
      delete: 'deleteAttachmentCategory',
      data: 'attachmentCategories'
    },
  };

  constructor(private attachmentCategoryService: AttachmentCategoryService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('attachmentCategory');

  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof AttachmentCategoryService;
    (this.attachmentCategoryService[methodName] as Function)().subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
          console.log(response.data.list)
        }
      },
      (error: any) => {
        console.error(`Error fetching ${entity}`, error);
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof AttachmentCategoryService;
    (this.attachmentCategoryService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof AttachmentCategoryService;
    (this.attachmentCategoryService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof AttachmentCategoryService;
    (this.attachmentCategoryService[methodName] as Function)(id, companyId).subscribe(
      (response: any) => {
        console.log(response)
        if (response.status === 200) {
          this.loadEntities(entity); // Reload the list
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }

  handleFormSubmission(data: AttachmentCategory) {
    if (this.isEdit) {
      console.log( "fgg",data)
      data.id = this.formData.id;
      data.companyId = this.companyId;
      this.editEntity('attachmentCategory', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('attachmentCategory', data);
    }
  }

  openAddModal() {
    this.isEdit = false;
    this.formData = {};
  }

  openEditModal(item: any) {
    this.isEdit = true;
    this.formData = item;
  }
}
