import { ToastersService } from './../../../../core/services/toast-service/toast.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { SalaryTypeService } from '../../../../services/lockupsServices/SalaryService/salary.service';
import { DropDownComponent } from "../../components/drop-down/drop-down.component";
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financial',
  standalone: true,
  imports: [CommonModule, TranslateModule, DropDownComponent, ModernTableComponent, ReactiveFormsModule],
  templateUrl: './financial.component.html',
  styleUrl: './financial.component.css'
})
export class FinancialComponent {
  activeTab: string = 'Entitlements';
  isDeduction = true;
  currentPageDropDown = 1;
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['id', 'amount', 'transactionDate'];
  form!: FormGroup;
  companyId = localStorage.getItem('companyId');
  employeeId!: number;
  salaryTypeId!: number;
  pageIndex: any = {
    "employeeSalary": 1
  };
  totalRows: any = {
    "employeeSalary": 0
  };
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private salaryTypeService: SalaryTypeService,
    private fb: FormBuilder,
    private toastersService: ToastersService
  ) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      id: 0,
      transactionDate: [''],
      companyId: this.companyId,
      employeeId: this.employeeId,
      salaryTypeId: this.salaryTypeId,
      amount: [null, [Validators.required, Validators.min(0)]]
    })
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.isDeduction = tab === 'Entitlements';
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

  loadEntitie(entity: string, pageIndex: number): void {
    const methodName = this.entityTypes[entity].load as keyof EmployeeService;
    (this.employeeService[methodName] as Function)({ pageIndex, isDeduction: this.isDeduction }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          (this as any)[this.entityTypes[entity].data] = response.data.list;
          this.pageIndex[entity] = response.data.pageIndex;
          console.log(response.data.list);
        }
      }
    );
  }

  loadEntitiesDropDown(entity: string, pageIndex: number): void {
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)({ pageIndex, isDeduction: this.isDeduction }).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.dropDownData.push(...response.data.list);
          this.currentPageDropDown = response.data.pageIndex
        }
      }
    );
  }


  searchInDropDown(entity: string, searchDataValue: string): void {
    const methodName = this.entityTypes[entity].load as keyof SalaryTypeService;
    (this.salaryTypeService[methodName] as Function)(searchDataValue.length ? { name: searchDataValue } : {}).subscribe(
      (response: any) => {
        if (response.status === 200) {
          this.dropDownData = response.data.list;
        }
      }
    );
  }


  dropDown(e: any) {
    this.salaryTypeId = e;
  }


  submit() {
    let payload = {
      // ...this.convertToTransactionDate(new Date(this.form.value.transactionDate)),
      transactionDate: this.form.value.transactionDate,
      companyId: Number(this.companyId),
      employeeId: this.employeeId,
      salaryTypeId: this.salaryTypeId,
      amount: this.form.value.amount,
      id: 0,
    }
    this.employeeService.addEmployeeSalary(payload).subscribe((res) => {
      this.toastersService.typeSuccess('Successfully Completed');
    });
  }

  convertToTransactionDate(date: Date) {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    };
  }

}
