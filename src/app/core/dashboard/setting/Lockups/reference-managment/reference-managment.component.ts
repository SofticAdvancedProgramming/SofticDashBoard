import { Component, OnInit } from '@angular/core';
import { ReferenceTypeService } from '../../../../../services/lockupsServices/ReferenceTypeService/reference-type.service';
import { reference } from '../../../../../../models/user';
import { DynamicModalComponent } from "../../../components/dynamic-modal/dynamic-modal.component";
import { ModernTableComponent } from "../../../components/modern-table/modern-table.component";

@Component({
  selector: 'app-reference-managment',
  standalone: true,
  templateUrl: './reference-managment.component.html',
  styleUrls: ['./reference-managment.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent]
})
export class ReferenceManagmentComponent implements OnInit {

  referenceTypes: any[] = [];
  columns: string[] = ['id','name', 'nameAr'];

  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
  ];

  formData:any;
  isEdit = false;
  modalId = 'AddEditReferenceType';
  companyId: number = 0;

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    referenceType: {
      load: 'getReferenceTypes',
      add: 'addReferenceType',
      edit: 'editReferenceType',
      delete: 'deleteReferenceType',
      data: 'referenceTypes'
    }
  };

  constructor(private referenceTypeService: ReferenceTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('referenceType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof ReferenceTypeService;
    (this.referenceTypeService[methodName] as Function)().subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof ReferenceTypeService;
    (this.referenceTypeService[methodName] as Function)(newEntity).subscribe(
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
    const methodName = this.entityTypes[entity].edit as keyof ReferenceTypeService;
    (this.referenceTypeService[methodName] as Function)(updatedEntity).subscribe(
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
    const methodName = this.entityTypes[entity].delete as keyof ReferenceTypeService;
    (this.referenceTypeService[methodName] as Function)(id, companyId).subscribe(
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

  handleFormSubmission(data: reference) {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('referenceType', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('referenceType', data);
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
