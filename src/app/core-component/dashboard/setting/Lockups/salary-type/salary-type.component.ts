import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { SalaryTypeService } from '../../../../../services/lockupsServices/SalaryService/salary.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-salary-type',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent, FormsModule, CommonModule, TranslateModule],
  templateUrl: './salary-type.component.html',
  styleUrls: ['./salary-type.component.css'],
})
export class SalaryTypeComponent {
  SalaryTypes: any[] = [];
  columns: string[] = ['name' , 'nameAr'];
  deleteId: string = 'deleteSalaryType';
  formData: any = {};
  isEdit = false;
  modalId = 'addSalaryType';
  companyId: number = 0;
  isDeduction = true;
  options = [
    { name: 'Deduction', value: true },
    { name: 'Addition', value: false },
  ];
  pageIndex: any = { SalaryType: 1 };
  totalRows: any = { SalaryType: 0 };
  structure = [
    { name: 'name', label: 'Name In English', type: 'text', required: true },
    { name: 'nameAr', label: 'Name In Arabic', type: 'text', required: true },
    { name: 'isDeduction', label: 'Deduction', type: 'checkbox', required: false },
  ];

  entityTypes: Record<
    string,
    { load: string; add: string; edit: string; delete: string; data: string }
  > = {
    SalaryType: {
      load: 'getSalaryTypes',
      add: 'addSalaryType',
      edit: 'editSalaryType',
      delete: 'deleteSalaryType',
      data: 'SalaryTypes',
    },
  };

  constructor(private salaryTypeService: SalaryTypeService, private translate:TranslateService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('SalaryType', 1);
    // this.translate.get(['name', 'nameAr']).subscribe(translations => {
    //   this.columns = [translations['name'], translations['nameAr']];
    // });
  }

  loadEntities(entity: string, pageIndex: number, name?: string): void {
    const query: any = {
      companyId: this.companyId,
      isDeduction: this.isDeduction,
      pageIndex,
    };
    if (name) {
      query.name = name;
    }

    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(query).subscribe((response: any) => {
      if (response.status === 200) {
        (this as any)[this.entityTypes[entity].data] = response.data.list;
        this.pageIndex[entity] = response.data.pageIndex;
        this.totalRows[entity] = response.data.totalRows;
      }
    });
  }

  addEntity(entity: string, newEntity: any): void {
    console.log(entity)
    console.log(newEntity)
    const methodName = this.entityTypes[entity].add as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(newEntity).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });

  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(updatedEntity).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(id, this.companyId).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }

  handleFormSubmission(data: any): void {
    data.companyId = this.companyId;
    if (this.isEdit) {
      data.id = this.formData.id;
      this.editEntity('SalaryType', data);
    } else {
      data.id = 0;
      this.addEntity('SalaryType', data);
    }
  }

  openAddModal(): void {
    this.isEdit = false;
    this.formData = { isDeduction: true }; 
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }

   onTypeChange(): void {
    this.loadEntities('SalaryType', 1);
  }
}
