import { ToastersService } from './../../../../core/services/toast-service/toast.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { SalaryTypeService } from '../../../../services/lockupsServices/SalaryService/salary.service';
import { DropDownComponent } from "../../components/drop-down/drop-down.component";
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DynamicModalComponent } from "../../components/dynamic-modal/dynamic-modal.component";

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, TranslateModule, DropDownComponent, ModernTableComponent, ReactiveFormsModule, DynamicModalComponent],
  providers: [DatePipe],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.css'
})
export class FinancialComponent {
  modalId = 'editEmployeeService';
  activeTab: string = 'Entitlements';
  isDeduction = true;
  isEdit = false;
  currentPageDropDown = 1;
  dropDownDataIsDeductionTrue: any[] = [];
  dropDownDataIsDeductionFalse: any[] = [];
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['amount', 'transactionDate'];
  form!: FormGroup;
  companyId = localStorage.getItem('companyId');
  employeeId!: number;
  salaryTypeId!: number;
  formData: any = {};
  pageIndex: any = {
    "employeeSalary": 1
  };
  totalRows: any = {
    "employeeSalary": 0
  };
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    { name: 'isDeduction', label: 'Deduction', type: 'checkbox', required: true },
  ];
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private salaryTypeService: SalaryTypeService,
    private fb: FormBuilder,
    private toastersService: ToastersService,
    private datePipe: DatePipe
  ) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      id: 0,
      transactionDate: [''],
      companyId: this.companyId,
      employeeId: this.employeeId,
      salaryTypeId: this.salaryTypeId,
      comment: [''],
      amount: [null, [Validators.required, Validators.min(0)]]
    })
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.isDeduction = tab === 'Deductions';
    this.loadEntitie('employeeSalary', 1);
    this.loadEntitiesDropDown('SalaryType', 1);
  }
  ngOnInit(): void {
    this.loadEntitiesDropDown('SalaryType', 1);
    this.loadEntitie('employeeSalary', 1);
  }

  entityTypes: { [key: string]: { load: string, add: string, edit: string, delete: string, data: any } } = {
    SalaryType: {
      load: 'getSalaryTypes',
      add: 'addSalaryType',
      edit: 'editSalaryType',
      delete: 'deleteSalaryType',
      data: 'SalaryTypes'
    },
    employeeSalary: {
      load: 'loadEmployeeSalary',
      add: 'addEmployeeSalary',
      edit: 'editEmployeeSalary',
      delete: 'deleteEmployeeSalary',
      data: 'financial'
    }
  };

  loadEntitie(entity: string, pageIndex: number, name?: string): void {
    let query: any = { companyId: this.companyId, isDeduction: this.isDeduction, pageIndex, ...this.getCurrentMonthDates() };
    if (name) {
      query = {
        ...query,
        name
      };
    }
    const methodName = this.entityTypes[entity].load as keyof EmployeeService;
    (this.employeeService[methodName] as Function)(query).subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list.map((res: any) => {
            return {
              ...res,
              transactionDate: this.datePipe.transform(res.transactionDate, 'yyyy-MM-dd')
            };
          });
          this.pageIndex[entity] = response.data.pageIndex;
          this.totalRows[entity] = response.data.totalRows;
        }
      }
    );
  }

  loadEntitiesDropDown(entity: string, pageIndex: number): void {
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)({
      pageIndex,
      isDeduction: this.isDeduction,
    }).subscribe((response: any) => {
      if (response.status === 200) {
        if (this.isDeduction) {
          this.dropDownDataIsDeductionFalse = [];
          this.dropDownDataIsDeductionTrue.push(...response.data.list);
          this.dropDownData = this.dropDownDataIsDeductionTrue;
        } else {
          this.dropDownDataIsDeductionTrue = [];
          this.dropDownDataIsDeductionFalse.push(...response.data.list);
          this.dropDownData = this.dropDownDataIsDeductionFalse;
        }
        this.currentPageDropDown = response.data.pageIndex;
      }
    });
  }


  searchInDropDown(entity: string, searchDataValue: string): void {
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(searchDataValue.length ? { name: searchDataValue } : {}).subscribe(
      (response: any) => {
        if (response.status === 200) {
          if (this.isDeduction == true) {
            this.dropDownDataIsDeductionTrue = response.data.list;
          } else {
            this.dropDownDataIsDeductionFalse = response.data.list;
          }
        }
      }
    );
  }


  dropDown(e: any) {
    this.salaryTypeId = e;
  }


  submit(): void {
    const payload = {
      transactionDate: this.form.value.transactionDate,
      companyId: Number(this.companyId),
      employeeId: this.employeeId,
      salaryTypeId: this.salaryTypeId,
      amount: this.form.value.amount,
      comment: this.form.value.comment,
      isDeduction: this.isDeduction,
      id: 0,
    };

    this.employeeService.addEmployeeSalary(payload).subscribe((res) => {
      this.toastersService.typeSuccess('Successfully Completed');
      this.loadEntitie('employeeSalary', 1);
    });
  }


  convertToTransactionDate(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

  handleFormSubmission(data: any): void {
    console.log(data, "data")
    if (this.isEdit) {
      data.companyId = this.companyId;
      data.id = this.formData.id;
      this.editEntity('SalaryType', data);
    }
  }

  editEntity(entity: string, updatedEntity: any): void {
    const methodName = this.entityTypes[entity].edit as keyof EmployeeService;
    (this.employeeService[methodName] as Function)(updatedEntity).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.loadEntitie(entity, this.pageIndex[entity]);
        }
      }
    );
  }

  openEditModal(item: any): void {
    this.isEdit = true;
    this.formData = { ...item, companyId: this.companyId };
  }

  getCurrentMonthDates(): { transactionDateFrom: string, transactionDateTo: string } {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactionDateFrom = this.datePipe.transform(startOfMonth, 'yyyy-MM-dd');
    const transactionDateTo = this.datePipe.transform(endOfMonth, 'yyyy-MM-dd');

    return {
      transactionDateFrom: transactionDateFrom || '',
      transactionDateTo: transactionDateTo || ''
    };
  }

}
