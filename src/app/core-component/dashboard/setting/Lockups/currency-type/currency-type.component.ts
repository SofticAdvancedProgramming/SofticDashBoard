import { Component } from '@angular/core';
import { DynamicModalComponent } from '../../../components/dynamic-modal/dynamic-modal.component';
import { ModernTableComponent } from '../../../components/modern-table/modern-table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CurrencyService } from '../../../../../services/lockupsServices/CurrencyService/currency.service';
import { CurrencyTableComponent } from '../../../components/currency-table/currency-table/currency-table.component';

@Component({
  selector: 'app-currency-type',
  standalone: true,
  imports: [DynamicModalComponent, ModernTableComponent, FormsModule, CommonModule, CurrencyTableComponent],
  templateUrl: './currency-type.component.html',
  styleUrl: './currency-type.component.css'
})
export class CurrencyTypeComponent {
  CurrencyTypes: any[] = [];
  columns: string[] = [  'name', 'nameAr'];
  deleteId: string = 'deleteCurrencyType';
  defaultId: string = 'defaultCurrencyType';
  formData: any = {};
  isEdit = false;
  modalId = 'addCurrencyType';
  companyId: number = 0;
  isDeduction = true;
  options = [
    { name: 'Deduction', value: true },
    { name: 'Addition', value: false },
  ];
  pageIndex: any = { CurrencyType: 1 };
  totalRows: any = { CurrencyType: 0 };
  structure = [
    { name: 'name', label: 'Name In Arabic', type: 'text', required: true },
    { name: 'nameAr', label: 'Name In English', type: 'text', required: true },
    { name: 'isDeduction', label: 'Deduction', type: 'checkbox', required: false },
  ];

  entityTypes: Record<
    string,
    { load: string; add: string; edit: string; delete: string; data: string; default:string }
  > = {
    CurrencyType: {
      load: 'getCurrencyTypes',
      add: 'addCurrencyType',
      edit: 'editCurrencyType',
      delete: 'deleteCurrencyType',
      default: 'defaultCurrencyType',
      data: 'CurrencyTypes',
    },
  };

  constructor(private currencyTypeService: CurrencyService) {
    this.companyId = Number(localStorage.getItem('companyId')) || 0;
  }

  ngOnInit(): void {
    this.loadEntities('CurrencyType', 1);
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

    const methodName = this.entityTypes[entity].load as keyof CurrencyService;
    this.currencyTypeService.getCurrencyTypes().subscribe({
      next:(response: any) => {
      if (response.status === 200) {
        (this as any)[this.entityTypes[entity].data] = response.data.list;
        console.log(response);
        this.pageIndex[entity] = response.data.pageIndex;
        this.totalRows[entity] = response.data.totalRows;
      }
    },
    error: (err:any) => console.log(err)
  });
  }

  addEntity(entity: string, newEntity: any): void {
    console.log(entity)
    console.log(newEntity)
    const methodName = this.entityTypes[entity].add as keyof CurrencyService;
    (this.currencyTypeService[methodName] as Function)(newEntity).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });

  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof CurrencyService;
    (this.currencyTypeService[methodName] as Function)(updatedEntity).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }

  deleteEntity(entity: string, id: number): void {
    const methodName = this.entityTypes[entity].delete as keyof CurrencyService;
    (this.currencyTypeService[methodName] as Function)(id, this.companyId).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }
  defaultEntity(entity: string, id: number): void{
    const methodName = this.entityTypes[entity].default as keyof CurrencyService;
    (this.currencyTypeService[methodName] as Function)(id, this.companyId).subscribe((response: any) => {
      if (response.status === 200) {
        this.loadEntities(entity, this.pageIndex[entity]);
      }
    });
  }

  handleFormSubmission(data: any): void {
    data.companyId = this.companyId;
    if (this.isEdit) {
      data.id = this.formData.id;
      this.editEntity('CurrencyType', data);
    } else {
      data.id = 0;
      this.addEntity('CurrencyType', data);
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
    this.loadEntities('CurrencyType', 1);
  }
}
