import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { SalaryTypeService } from '../../../../../services/lockupsServices/SalaryService/salary.service';

@Component({
  selector: 'app-salary-type',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent],
  templateUrl: './salary-type.component.html',
  styleUrl: './salary-type.component.css'
})
export class SalaryTypeComponent {
  SalaryTypes: any[] = [];
  columns: string[] = ['id', 'name', 'nameAr', 'isDeduction'];
  deleteId: string = 'deleteSalaryType';
  formData: any = {};
  isEdit = false;
  modalId = 'addSalaryType';
  companyId: number = 0;
  isDeduction = true;
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'isDeduction', label: 'is Deduction', type: 'checkbox', required: true },
  ];

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: string } } = {
    SalaryType: {
      load: 'getSalaryTypes',
      add: 'addSalaryType',
      edit: 'editSalaryType',
      delete: 'deleteSalaryType',
      data: 'SalaryTypes'
    }
  };

  constructor(private salaryTypeService: SalaryTypeService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('SalaryType');
  }

  loadEntities(entity: string): void {
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)({ companyId: this.companyId }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
        }
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity);
        }
      }
    );
  }

  handleFormSubmission(data: any): void {
    console.log(data, "data")
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('SalaryType', data);
    } else {
      data.id = 0;
      data.companyId = this.companyId;
      this.addEntity('SalaryType', data);
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
