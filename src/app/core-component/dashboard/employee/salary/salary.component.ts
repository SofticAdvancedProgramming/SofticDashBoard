import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { ModernTableComponent } from "../../components/modern-table/modern-table.component";
import { SalaryTypeService } from '../../../../services/lockupsServices/SalaryService/salary.service';
import { ToastersService } from '../../../../core/services/toast-service/toast.service';
import { CommonModule, DatePipe } from '@angular/common';

interface Salary {
  grossSalary: string;
  netSalary: string;
}

interface EmployeeResponse {
  data: {
    list: Array<{
      grossSalary: string;
      netSalary: string;
    }>;
  };
  message: string;
}

@Component({
    selector: 'app-salary',
    standalone: true,
    templateUrl: './salary.component.html',
    styleUrls: ['./salary.component.css'],
    imports: [TranslateModule, ReactiveFormsModule, ModernTableComponent , CommonModule,DatePipe],
    providers: [DatePipe] 
})
export class SalaryComponent implements OnInit {
  modalId = 'editEmployeeService';
  activeTab: string = 'Entitlements';
  isDeduction = true;
  todayDate: string="";
  isEdit = false;
  currentPageDropDown = 1;
  dropDownDataIsDeductionTrue: any[] = [];
  dropDownDataIsDeductionFalse: any[] = [];
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['amount', 'transactionDate'];
   companyId = localStorage.getItem('companyId');
   salaryTypeId!: number;
  formData: any = {};
  pageIndex: any = {
    employeeSalary: 1,
  };
  totalRows: any = {
    employeeSalary: 0,
  };
  structure = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'nameAr', label: 'NameAr', type: 'text', required: true },
    {
      name: 'isDeduction',
      label: 'Deduction',
      type: 'checkbox',
      required: true,
    },
  ];
  form!: FormGroup;
  employeeId = 0;

  constructor(
       private toast: ToastrService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private salaryTypeService: SalaryTypeService,
    private fb: FormBuilder,
    private toastersService: ToastersService,
    private datePipe: DatePipe
  ) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.initForm();
    this.getSalary();
  }

  initForm(): void {
    this.form = this.fb.group({
      employeeId: [this.employeeId],
      netSalary: ['', [Validators.required]],
      grossSalary: ['', [Validators.required]]
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.employeeService.assginEmployeeSalary(this.form.value).subscribe(
      (res) => this.toast.success(this.translate.instant('employeeDetails.SALARY_ASSIGN_SUCCESS')),
    );
  }


  initFormWithSalary(salary: Salary) {
    this.form.patchValue(salary);
  }

  getSalary() {
    this.employeeService.loadEmployees({ id: this.employeeId }).subscribe(
      (res: EmployeeResponse) => {
        const { grossSalary, netSalary } = res.data.list[0];
        this.initFormWithSalary({ grossSalary, netSalary });
      }
    );
  }

  loadEntitie(entity: string, pageIndex: number, name?: string): void {
    
  }
}
