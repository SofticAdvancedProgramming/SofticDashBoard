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
import { BenefitTypeService } from '../../../../services/benefitTypeService/benefit-type.service';
import { BenefitService } from '../../../../services/benefitService/benefit.service';

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
  imports: [TranslateModule, ReactiveFormsModule, ModernTableComponent, CommonModule, DatePipe],
  providers: [DatePipe]
})
export class SalaryComponent implements OnInit {
  modalId = 'editEmployeeService';
  activeTab: string = 'Entitlements';
  isDeduction = true;
  todayDate: string = "";
  isEdit = false;
  currentPageDropDown = 1;
  dropDownDataIsDeductionTrue: any[] = [];
  dropDownDataIsDeductionFalse: any[] = [];
  dropDownData: any[] = [];
  financial: any[] = [];
  columns: string[] = ['amount', 'transactionDate'];
  companyId = localStorage.getItem('companyId');
  salaryTypeId!: number;
  benefitTypes: any[] = [];
  benefitForm!: FormGroup;
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
    private datePipe: DatePipe,
    private benefitTypeService: BenefitTypeService,
    private benefitService: BenefitService
  ) {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.initForm();
    this.initBenefitForm();
    this.getSalary();
    this.loadBenefitTypes();
  }


  initForm(): void {
    this.form = this.fb.group({
      employeeId: [this.employeeId],
      netSalary: ['', [Validators.required]],
    });
  }

  submitSalary() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    const { netSalary } = this.form.value;
  
     const grossSalary = netSalary;   
  
    const salaryData = {
      employeeId: this.employeeId,
      netSalary,
      grossSalary,   
    };
  
    this.employeeService.assginEmployeeSalary(salaryData).subscribe(
      (res) => {
        this.toast.success(this.translate.instant('employeeDetails.SALARY_ASSIGN_SUCCESS'));
        this.getSalary();  
      },
      (error) => {
        this.toast.error(this.translate.instant('employeeDetails.SALARY_ASSIGN_ERROR'));
        console.error('Error assigning salary:', error);
      }
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
  loadBenefitTypes() {
    this.benefitTypeService.getBenefitsType().subscribe(
      (response) => {
        if (response.status === 200) {
          this.benefitTypes = response.data.list;
        } else {
          this.toast.error('Failed to load benefit types');
        }
      },
      (error) => {
        console.error('Error loading benefit types:', error);
        this.toast.error('Error loading benefit types');
      }
    );
  }
  submitBenefit() {
    if (this.benefitForm.invalid) {
      console.log('Form is invalid');
      this.benefitForm.markAllAsTouched();
      return;
    }

    const benefitData = {
      ...this.benefitForm.value,
      benefitTypeId: Number(this.benefitForm.value.benefitTypeId)
    };

    console.log('Benefit Data:', benefitData);

    this.benefitService.addEmployeeBenefit(benefitData).subscribe(
      (res) => {
        this.toast.success(this.translate.instant('employeeDetails.BENEFIT_ASSIGN_SUCCESS'));
        this.getSalary();
      },
      (error) => {
        console.error('Error submitting benefit:', error);
        this.toast.error('Error submitting benefit');
      }
    );
  }



  initBenefitForm(): void {
    this.benefitForm = this.fb.group({
      employeeId: [this.employeeId],
      benefitTypeId: [null, [Validators.required]],
      amount: [null, [Validators.required, Validators.min(0)]],
    });
  }

}