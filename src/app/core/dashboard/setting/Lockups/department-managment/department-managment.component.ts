import { Component, OnInit } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { Department } from '../../../../../../models/department';
import { DepartmentService } from '../../../../../services/lockupsServices/DepartmentService/department.service';


@Component({
  selector: 'app-department-managment',
  standalone: true,
  templateUrl: './department-managment.component.html',
  styleUrls: ['./department-managment.component.css'],
  imports: [DynamicModalComponent, ModernTableComponent]
})
export class DepartmentManagmentComponent implements OnInit {
  Departments: Department[] = [];
  columns: string[] = ['id', 'name', 'shortName', 'manager'];
  deleteId: string = 'deleteDepartment';
  formData: any;
  isEdit = false;
  modalId = 'AddDepartment';
  companyId: number = 0;
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'shortName', label: 'Short Name', type: 'text', required: true },
    { name: 'nameAr', label: 'Name (Arabic)', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text', required: true },
    { name: 'descriptionAr', label: 'Description (Arabic)', type: 'text', required: true },
    { name: 'manager', label: 'Manager', type: 'text', required: true },
    { name: 'lat', label: 'Latitude', type: 'number', required: true },
    { name: 'long', label: 'Longitude', type: 'number', required: true },
  ];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    Department: {
      load: 'getDepartment',
      add: 'addDepartment',
      edit: 'editDepartment',
      delete: 'deleteDepartment',
      data: 'Departments'
    }
  };

  constructor(private departmentService: DepartmentService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('Department');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof DepartmentService;
    (this.departmentService[methodName] as Function)({ companyId: this.companyId }).subscribe(
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
    const methodName = this.entityTypes[entity].add as keyof DepartmentService;
    (this.departmentService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error adding ${entity}`, error);
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof DepartmentService;
    (this.departmentService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error updating ${entity}`, error);
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof DepartmentService;
    (this.departmentService[methodName] as Function)(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      },
      (error: any) => {
        console.error(`Error deleting ${entity}`, error);
      }
    );
  }

  handleFormSubmission(data: any): void {
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('Department', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('Department', data);
    }
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = {};
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }
}
