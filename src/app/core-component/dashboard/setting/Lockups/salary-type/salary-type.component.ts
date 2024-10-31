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
  columns: string[] = ['id', 'name', 'nameAr'];
  deleteId: string = 'deleteSalaryType';
  formData: any = {};
  isEdit = false;
  modalId = 'addSalaryType';
  companyId: number = 0;
  isDeduction = true;
  options = [{ name: 'Deduction', value: false }, { name: 'Addition', value: true }]
  pageIndex: any = {
    "SalaryType": 1
  };
  totalRows: any = {
    "SalaryType": 0
  };
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'isDeduction', label: 'Deduction', type: 'checkbox', required: false },
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
    this.loadEntities('SalaryType', 1);
  }

  loadEntities(entity: string, pageIndex: number, name?: string): void {
    let query: any = { companyId: this.companyId, isDeduction: this.isDeduction, pageIndex };
    if (name) {
      query = {
        ...query,
        name
      };
    }
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(query).subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
          this.pageIndex[entity] = response.data.pageIndex;
          this.totalRows[entity] = response.data.totalRows;
        }
      }
    );
  }

  addEntity(entity: string, newEntity: any): void {
    const methodName = this.entityTypes[entity].add as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(newEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]);
        }
      }
    );
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]);
        }
      }
    );
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(id, this.companyId).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntities(entity, this.pageIndex[entity]);
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

  onTypeChange(event: any) {
    this.isDeduction = event.target.value === "true";
    this.loadEntities('SalaryType', 1);
  }
}
